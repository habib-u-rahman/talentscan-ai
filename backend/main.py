from dotenv import load_dotenv
load_dotenv(override=True)

from fastapi import FastAPI, File, Form, UploadFile, HTTPException, Depends, status, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import inspect, text
from typing import List
from pydantic import BaseModel
import secrets
import json
from datetime import datetime, timedelta, timezone

from database import engine, get_db
from models import Base, User, ScreeningHistory, PasswordResetToken
from schemas import SignupRequest, LoginRequest, LoginResponse, UserOut, HistoryCreate, HistoryOut
from auth import hash_password, verify_password, create_access_token
from dependencies import get_current_user, get_optional_user
from email_service import (
    send_verification_email,
    send_welcome_email,
    send_password_reset_email,
)

from nlp.extractor import extract_text
from nlp.scorer import screen
import threading
import os

_key = os.environ.get("GROQ_API_KEY", "NOT SET")
print(f"[startup] GROQ_API_KEY loaded: {_key[:8]}...{_key[-4:]} (len={len(_key)})")


def _store_embeddings_bg(user_id: int, resume_data: list, pipeline: list):
    from database import SessionLocal
    from nlp.rag import store_embeddings
    db = SessionLocal()
    try:
        store_embeddings(user_id, resume_data, pipeline, db)
    except Exception:
        pass
    finally:
        db.close()


# ── Create / migrate tables on startup ────────────────────────────────────────

Base.metadata.create_all(bind=engine)

with engine.connect() as conn:
    existing_cols = {c["name"] for c in inspect(engine).get_columns("users")}

    if "is_verified" not in existing_cols:
        conn.execute(text(
            "ALTER TABLE users ADD COLUMN is_verified BOOLEAN NOT NULL DEFAULT TRUE"
        ))
        conn.commit()

    if "verification_token" not in existing_cols:
        conn.execute(text(
            "ALTER TABLE users ADD COLUMN verification_token VARCHAR(64) UNIQUE"
        ))
        conn.commit()

    sh_cols = {c["name"] for c in inspect(engine).get_columns("screening_history")}

    if "avg_score" not in sh_cols:
        conn.execute(text("ALTER TABLE screening_history ADD COLUMN avg_score FLOAT"))
        conn.commit()

    if "top_score" not in sh_cols:
        conn.execute(text("ALTER TABLE screening_history ADD COLUMN top_score FLOAT"))
        conn.commit()

    if "results_json" not in sh_cols:
        conn.execute(text("ALTER TABLE screening_history ADD COLUMN results_json TEXT"))
        conn.commit()


app = FastAPI(title="Talant Scan AI")


@app.on_event("startup")
async def warmup():
    threading.Thread(
        target=lambda: __import__("nlp.embedder", fromlist=["_get_model"])._get_model(),
        daemon=True,
    ).start()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://192.168.100.56:3000",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ══════════════════════════════════════════════════════════════════════════════
# AUTH
# ══════════════════════════════════════════════════════════════════════════════

@app.post("/api/signup", status_code=status.HTTP_201_CREATED)
def signup(body: SignupRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == body.email.strip().lower()).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists.",
        )
    verification_token = secrets.token_hex(32)
    user = User(
        name=body.name.strip(),
        email=body.email.strip().lower(),
        hashed_password=hash_password(body.password),
        is_verified=False,
        verification_token=verification_token,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    background_tasks.add_task(send_verification_email, user.email, user.name, verification_token)

    return {"message": "Account created! Please check your email to verify your account."}


@app.post("/api/login", response_model=LoginResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email.strip().lower()).first()
    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
        )
    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="EMAIL_NOT_VERIFIED",
        )
    token = create_access_token(user.id)
    return LoginResponse(
        access_token=token,
        user=UserOut(id=user.id, name=user.name, email=user.email),
    )


@app.get("/api/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return current_user


# ══════════════════════════════════════════════════════════════════════════════
# EMAIL VERIFICATION
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/verify-email")
def verify_email(token: str, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.verification_token == token).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This verification link is invalid or has already been used.",
        )
    if user.is_verified:
        return {"message": "Your email is already verified. Please sign in."}

    user.is_verified = True
    db.commit()

    background_tasks.add_task(send_welcome_email, user.email, user.name)

    return {"message": "Email verified successfully! You can now sign in."}


class ResendVerificationRequest(BaseModel):
    email: str


@app.post("/api/resend-verification")
def resend_verification(body: ResendVerificationRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email.strip().lower()).first()
    if not user or user.is_verified:
        return {"message": "If that email exists and needs verification, a new link has been sent."}

    new_token = secrets.token_hex(32)
    user.verification_token = new_token
    db.commit()

    background_tasks.add_task(send_verification_email, user.email, user.name, new_token)
    return {"message": "A new verification email has been sent."}


# ══════════════════════════════════════════════════════════════════════════════
# SCREENING HISTORY
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/history", response_model=List[HistoryOut])
def get_history(
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user),
):
    entries = (
        db.query(ScreeningHistory)
        .filter(ScreeningHistory.user_id == current_user.id)
        .order_by(ScreeningHistory.created_at.desc())
        .limit(50)
        .all()
    )
    result = []
    for e in entries:
        result.append(HistoryOut(
            id=e.id,
            title=e.title,
            resume_count=e.resume_count,
            avg_score=e.avg_score,
            top_score=e.top_score,
            job_description=e.job_description,
            results=json.loads(e.results_json) if e.results_json else None,
            created_at=e.created_at,
        ))
    return result


@app.post("/api/history", response_model=HistoryOut, status_code=status.HTTP_201_CREATED)
def save_history(
    body:         HistoryCreate,
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user),
):
    entry = ScreeningHistory(
        user_id=current_user.id,
        title=body.title,
        resume_count=body.resume_count,
        job_description=body.job_description,
        avg_score=body.avg_score,
        top_score=body.top_score,
        results_json=json.dumps(body.results) if body.results else None,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@app.delete("/api/history/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_history_entry(
    entry_id:     int,
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user),
):
    entry = (
        db.query(ScreeningHistory)
        .filter(
            ScreeningHistory.id == entry_id,
            ScreeningHistory.user_id == current_user.id,
        )
        .first()
    )
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found.")
    db.delete(entry)
    db.commit()


@app.delete("/api/history", status_code=status.HTTP_204_NO_CONTENT)
def clear_history(
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user),
):
    db.query(ScreeningHistory).filter(
        ScreeningHistory.user_id == current_user.id
    ).delete()
    db.commit()


# ══════════════════════════════════════════════════════════════════════════════
# FORGOT / RESET PASSWORD
# ══════════════════════════════════════════════════════════════════════════════

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


@app.post("/api/forgot-password")
def forgot_password(body: ForgotPasswordRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email.strip().lower()).first()
    if not user:
        return {"message": "If that email exists, a reset link has been sent."}

    db.query(PasswordResetToken).filter(
        PasswordResetToken.user_id == user.id,
        PasswordResetToken.used == False,
    ).update({"used": True})

    token = secrets.token_hex(32)
    expires_at = datetime.now(timezone.utc) + timedelta(hours=1)
    db.add(PasswordResetToken(user_id=user.id, token=token, expires_at=expires_at))
    db.commit()

    background_tasks.add_task(send_password_reset_email, user.email, user.name, token)
    return {"message": "Password reset email sent."}


@app.post("/api/reset-password")
def reset_password(body: ResetPasswordRequest, db: Session = Depends(get_db)):
    if len(body.new_password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters.",
        )
    record = db.query(PasswordResetToken).filter(
        PasswordResetToken.token == body.token,
        PasswordResetToken.used == False,
    ).first()
    if not record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or already used reset link.",
        )
    if record.expires_at < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This reset link has expired. Please request a new one.",
        )
    user = db.query(User).filter(User.id == record.user_id).first()
    user.hashed_password = hash_password(body.new_password)
    record.used = True
    db.commit()
    return {"message": "Password updated successfully."}


# ══════════════════════════════════════════════════════════════════════════════
# ANALYTICS
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/analytics")
def get_analytics(
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user),
):
    from collections import defaultdict
    from nlp.scorer import SKILLS

    entries = (
        db.query(ScreeningHistory)
        .filter(ScreeningHistory.user_id == current_user.id)
        .order_by(ScreeningHistory.created_at)
        .all()
    )

    total_screenings = len(entries)
    total_resumes    = sum(e.resume_count for e in entries)

    scored     = [e for e in entries if e.avg_score is not None]
    avg_score  = round(sum(e.avg_score for e in scored) / len(scored), 1) if scored else None
    pass_rate  = round(
        sum(1 for e in scored if (e.top_score or 0) >= 70) / len(scored) * 100, 1
    ) if scored else None

    by_date = defaultdict(lambda: {"screenings": 0, "resumes": 0, "scores": []})
    for e in entries:
        d = e.created_at.strftime("%b %d")
        by_date[d]["screenings"] += 1
        by_date[d]["resumes"]    += e.resume_count
        if e.avg_score is not None:
            by_date[d]["scores"].append(e.avg_score)

    activity = [
        {
            "date":       d,
            "screenings": v["screenings"],
            "resumes":    v["resumes"],
            "avg":        round(sum(v["scores"]) / len(v["scores"]), 1) if v["scores"] else None,
        }
        for d, v in by_date.items()
    ]

    skill_freq = defaultdict(int)
    for e in entries:
        if e.job_description:
            jd_lower = e.job_description.lower()
            for skill in SKILLS:
                if skill in jd_lower:
                    skill_freq[skill] += 1

    top_skills = sorted(
        [{"skill": s, "count": c} for s, c in skill_freq.items()],
        key=lambda x: -x["count"],
    )[:12]

    recent = [
        {
            "id":           e.id,
            "title":        e.title,
            "resume_count": e.resume_count,
            "avg_score":    e.avg_score,
            "top_score":    e.top_score,
            "created_at":   e.created_at.isoformat(),
        }
        for e in reversed(entries[-5:])
    ]

    return {
        "total_screenings": total_screenings,
        "total_resumes":    total_resumes,
        "avg_score":        avg_score,
        "pass_rate":        pass_rate,
        "activity":         activity,
        "top_skills":       top_skills,
        "recent":           recent,
    }


# ══════════════════════════════════════════════════════════════════════════════
# NLP SCREENING
# ══════════════════════════════════════════════════════════════════════════════

@app.post("/api/screen")
async def screen_resumes(
    background_tasks: BackgroundTasks,
    job_description:  str              = Form(...),
    resumes:          List[UploadFile] = File(...),
    current_user:     User             = Depends(get_optional_user),
):
    resume_data = []
    for file in resumes:
        content = await file.read()
        text = extract_text(file.filename, content)
        resume_data.append({"filename": file.filename, "text": text})

    result = screen(job_description, resume_data)

    if current_user:
        background_tasks.add_task(
            _store_embeddings_bg, current_user.id, resume_data, result["pipeline"]
        )

    return result


# ══════════════════════════════════════════════════════════════════════════════
# CHATBOT
# ══════════════════════════════════════════════════════════════════════════════

class ChatRequest(BaseModel):
    message: str
    history: List[dict] = []


@app.post("/api/chat")
def chat(
    data:         ChatRequest,
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user),
):
    try:
        from nlp.rag import rag_chat
        reply = rag_chat(data.message, current_user.id, data.history, db)
    except Exception as e:
        reply = f"An unexpected error occurred: {str(e)}"
    return {"reply": reply}


@app.post("/api/chat/stream")
def chat_stream(
    data:         ChatRequest,
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user),
):
    from nlp.rag import rag_chat_stream

    def generate():
        yield from rag_chat_stream(data.message, current_user.id, data.history, db)

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
