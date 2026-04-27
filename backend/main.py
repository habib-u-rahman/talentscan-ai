import hashlib
import json
import os

from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

from nlp.extractor import extract_text
from nlp.scorer import screen

from pydantic import BaseModel   # ✅ ADDED (ONLY THIS EXTRA IMPORT)

app = FastAPI(title="Talant Scan AI")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── simple user store ──────────────────────────────────────────────────────────
USERS_FILE = os.path.join(os.path.dirname(__file__), "users.json")

def _load_users() -> list:
    if not os.path.exists(USERS_FILE):
        return []
    with open(USERS_FILE, "r") as f:
        return json.load(f)

def _save_users(users: list):
    with open(USERS_FILE, "w") as f:
        json.dump(users, f, indent=2)

def _hash(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


class AuthBody(BaseModel):
    name: str | None = None
    email: str
    password: str


# ── auth endpoints ─────────────────────────────────────────────────────────────
@app.post("/api/signup")
def signup(body: AuthBody):
    users = _load_users()
    if any(u["email"] == body.email for u in users):
        raise HTTPException(status_code=400, detail="An account with this email already exists.")
    users.append({"name": body.name or "", "email": body.email, "password": _hash(body.password)})
    _save_users(users)
    return {"message": "Account created successfully! Please sign in."}


@app.post("/api/login")
def login(body: AuthBody):
    users = _load_users()
    user = next((u for u in users if u["email"] == body.email), None)
    if not user or user["password"] != _hash(body.password):
        raise HTTPException(status_code=401, detail="Incorrect email or password.")
    return {"user": {"name": user["name"], "email": user["email"]}}


# ── NLP endpoints ──────────────────────────────────────────────────────────────
@app.post("/api/screen")
async def screen_resumes(
    job_description: str = Form(...),
    resumes: List[UploadFile] = File(...),
):
    resume_data = []
    for file in resumes:
        content = await file.read()
        text = extract_text(file.filename, content)
        resume_data.append({"filename": file.filename, "text": text})

    result = screen(job_description, resume_data)
    return result


# =========================
# ✅ ONLY CHAT ADDED BELOW
# =========================




class ChatRequest(BaseModel):
    message: str


@app.post("/api/chat")
async def chat(data: ChatRequest):

    msg = data.message.lower()

    # =========================
    # GREETINGS
    # =========================
    greetings = ["hi", "hello", "hey", "good morning", "good evening"]
    if any(word in msg for word in greetings):
        return {
            "reply": (
                "Hello 👋 I am TalentScan AI Assistant.\n"
                "I can help you with resume screening, NLP, scoring, and system workflow."
            )
        }

    # =========================
    # WHAT CAN YOU DO
    # =========================
    if "what can you do" in msg or "help" in msg:
        return {
            "reply": (
                "🤖 I can help you with:\n"
                "- Resume screening process\n"
                "- Candidate ranking system\n"
                "- NLP & AI explanation\n"
                "- Skill extraction\n"
                "- Experience analysis\n"
                "- Job matching workflow\n"
            )
        }

    # =========================
    # RESUME SCREENING
    # =========================
    if "resume" in msg or "screen" in msg:
        return {
            "reply": (
                "📄 Resume Screening:\n"
                "TalentScan AI extracts text from resumes using NLP, identifies skills "
                "and matches them with job descriptions to rank candidates automatically."
            )
        }

    # =========================
    # SCORING / RANKING
    # =========================
    if "score" in msg or "ranking" in msg or "rank" in msg:
        return {
            "reply": (
                "📊 Candidate Ranking:\n"
                "Candidates are ranked based on skill match, experience, keyword relevance, "
                "and job description similarity score."
            )
        }

    # =========================
    # NLP / AI
    # =========================
    if "nlp" in msg or "ai" in msg or "machine learning" in msg:
        return {
            "reply": (
                "🤖 NLP Engine:\n"
                "We use Natural Language Processing (NLP) to extract skills, education, "
                "and experience from resumes automatically."
            )
        }

    # =========================
    # WORKFLOW / HOW IT WORKS
    # =========================
    if "how it work" in msg or "workflow" in msg or "process" in msg:
        return {
            "reply": (
                "⚙️ Workflow:\n"
                "1. Upload resumes\n"
                "2. Enter job description\n"
                "3. NLP extracts data from resumes\n"
                "4. AI compares skills with job requirements\n"
                "5. System returns ranked candidates"
            )
        }

    # =========================
    # SKILLS
    # =========================
    if "skill" in msg or "extract skill" in msg:
        return {
            "reply": (
                "🧠 Skill Extraction:\n"
                "TalentScan AI automatically detects technical and soft skills "
                "from resumes using NLP and keyword extraction."
            )
        }

    # =========================
    # EXPERIENCE
    # =========================
    if "experience" in msg or "work history" in msg:
        return {
            "reply": (
                "💼 Experience Analysis:\n"
                "The system evaluates candidate experience and matches it "
                "with job requirements for better ranking."
            )
        }

    # =========================
    # UPLOAD
    # =========================
    if "upload" in msg or "resume upload" in msg:
        return {
            "reply": (
                "📤 Resume Upload:\n"
                "You can upload multiple resumes in PDF or TXT format. "
                "Each resume will be processed and ranked automatically."
            )
        }

    # =========================
    # JOB DESCRIPTION
    # =========================
    if "job description" in msg or "jd" in msg:
        return {
            "reply": (
                "📄 Job Description Matching:\n"
                "TalentScan AI compares job descriptions with resumes "
                "to find the best matching candidates."
            )
        }

    # =========================
    # ACCURACY
    # =========================
    if "accuracy" in msg or "performance" in msg:
        return {
            "reply": (
                "📈 Accuracy:\n"
                "The system improves accuracy using NLP-based extraction "
                "and weighted scoring of skills and experience."
            )
        }

    # =========================
    # BEST CANDIDATE
    # =========================
    if "best candidate" in msg or "who is best" in msg:
        return {
            "reply": (
                "🏆 Best Candidate:\n"
                "The top candidate is selected based on highest match score "
                "from skills, experience, and job relevance."
            )
        }

    # =========================
    # DEFAULT RESPONSE
    # =========================
    return {
        "reply": (
            "⚠️ I can only answer TalentScan AI related questions.\n\n"
            "Try asking about:\n"
            "- Resume screening\n"
            "- Candidate ranking\n"
            "- NLP processing\n"
            "- Skills & experience\n"
            "- System workflow"
        )
    }

