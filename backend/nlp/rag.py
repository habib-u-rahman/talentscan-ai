import os
import json
import numpy as np
import requests
from sqlalchemy.orm import Session

from .embedder import embed


# ── Groq API helpers ──────────────────────────────────────────────────────────

def _call_groq(prompt: str) -> str:
    api_key = os.environ["GROQ_API_KEY"]
    resp = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        json={
            "model":       "llama-3.1-8b-instant",
            "messages":    [{"role": "user", "content": prompt}],
            "temperature": 0.3,
            "max_tokens":  1024,
        },
        timeout=60,
    )
    resp.raise_for_status()
    return resp.json()["choices"][0]["message"]["content"]


def _stream_groq(prompt: str):
    api_key = os.environ["GROQ_API_KEY"]
    resp = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        json={
            "model":       "llama-3.1-8b-instant",
            "messages":    [{"role": "user", "content": prompt}],
            "temperature": 0.3,
            "max_tokens":  1024,
            "stream":      True,
        },
        stream=True,
        timeout=60,
    )
    resp.raise_for_status()
    for line in resp.iter_lines():
        if not line:
            continue
        decoded = line.decode("utf-8") if isinstance(line, bytes) else line
        if not decoded.startswith("data: "):
            continue
        data = decoded[6:].strip()
        if data == "[DONE]":
            break
        try:
            delta = json.loads(data)["choices"][0]["delta"].get("content", "")
            if delta:
                yield delta
        except (json.JSONDecodeError, KeyError, IndexError):
            continue


# ── Prompt builder ────────────────────────────────────────────────────────────

def _build_prompt(query: str, chunks: list, history: list) -> str:
    context = "\n\n---\n".join([
        f"Candidate: {c['name']} | File: {c['filename']} | Score: {c['score']}%\n"
        f"Matched Skills: {', '.join(c['skills']) or 'none'}\n"
        f"Missing Skills: {', '.join(c['missing']) or 'none'}\n"
        f"Resume Excerpt:\n{c['text'][:600]}"
        for c in chunks
    ])
    history_text = ""
    if history:
        history_text = "\nCONVERSATION HISTORY:\n" + "\n".join([
            f"{'User' if m['role'] == 'user' else 'Assistant'}: {m['text']}"
            for m in history[-6:]
        ])
    return (
        "You are TalentScan AI, an intelligent hiring assistant. "
        "Answer questions based ONLY on the candidate data provided below. "
        "Be concise and helpful. Use **bold** for candidate names and scores. "
        "Reference specific candidate names and scores when relevant. "
        "If the data doesn't contain enough information to answer, say so briefly.\n\n"
        f"RETRIEVED CANDIDATE DATA:\n{context}"
        f"{history_text}\n\n"
        f"USER QUESTION: {query}"
    )


# ── Embeddings storage ────────────────────────────────────────────────────────

def store_embeddings(user_id: int, resume_data: list, pipeline: list, db: Session):
    from models import ResumeEmbedding

    pipeline_by_file = {p["filename"]: p for p in pipeline}

    for resume in resume_data:
        p = pipeline_by_file.get(resume["filename"], {})
        try:
            vec = embed(resume["text"][:3000])
        except Exception:
            continue

        entry = ResumeEmbedding(
            user_id=user_id,
            filename=resume["filename"],
            name=p.get("name", "Unknown"),
            chunk_text=resume["text"][:4000],
            embedding_json=json.dumps(vec),
            score=p.get("final_score"),
            skills_json=json.dumps(p.get("matched_skills", [])),
            missing_json=json.dumps(p.get("missing_skills", [])),
        )
        db.add(entry)

    try:
        db.commit()
    except Exception:
        db.rollback()


# ── Retrieval ─────────────────────────────────────────────────────────────────

def retrieve(query: str, user_id: int, db: Session, k: int = 5) -> list:
    from models import ResumeEmbedding

    all_rows = (
        db.query(ResumeEmbedding)
        .filter(ResumeEmbedding.user_id == user_id)
        .all()
    )
    if not all_rows:
        return []

    query_vec = np.array(embed(query), dtype=np.float32)
    scored = []
    for r in all_rows:
        if not r.embedding_json:
            continue
        vec = np.array(json.loads(r.embedding_json), dtype=np.float32)
        scored.append((float(np.dot(query_vec, vec)), r))

    scored.sort(key=lambda x: -x[0])
    return [
        {
            "filename": r.filename,
            "name":     r.name,
            "score":    r.score,
            "skills":   json.loads(r.skills_json)  if r.skills_json  else [],
            "missing":  json.loads(r.missing_json) if r.missing_json else [],
            "text":     r.chunk_text or "",
        }
        for _, r in scored[:k]
    ]


# ── Chat interfaces ───────────────────────────────────────────────────────────

def rag_chat(query: str, user_id: int, history: list, db: Session) -> str:
    try:
        chunks = retrieve(query, user_id, db)
    except Exception as e:
        return f"Error loading candidate data: {str(e)}"

    if not chunks:
        return (
            "I don't have any screening data for you yet. "
            "Please screen some resumes first — then I can answer questions about your candidates."
        )
    try:
        return _call_groq(_build_prompt(query, chunks, history))
    except Exception as e:
        return f"I encountered an error generating a response: {str(e)}"


def rag_chat_stream(query: str, user_id: int, history: list, db: Session):
    """Yields SSE-formatted strings for the streaming endpoint."""
    try:
        chunks = retrieve(query, user_id, db)
    except Exception as e:
        yield f"data: {json.dumps({'error': f'Error loading data: {str(e)}'})}\n\n"
        yield "data: [DONE]\n\n"
        return

    if not chunks:
        msg = "I don't have any screening data yet. Please screen some resumes first."
        yield f"data: {json.dumps({'content': msg})}\n\n"
        yield "data: [DONE]\n\n"
        return

    sources = [
        {"name": c["name"], "score": c["score"], "filename": c["filename"]}
        for c in chunks[:3]
    ]
    yield f"data: {json.dumps({'status': 'generating', 'sources': sources})}\n\n"

    prompt = _build_prompt(query, chunks, history)
    try:
        for token in _stream_groq(prompt):
            yield f"data: {json.dumps({'content': token})}\n\n"
    except Exception as e:
        yield f"data: {json.dumps({'error': str(e)})}\n\n"

    yield "data: [DONE]\n\n"
