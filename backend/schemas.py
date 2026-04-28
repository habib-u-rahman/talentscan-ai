from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# ── Auth ──────────────────────────────────────────────────────────────────────

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class UserOut(BaseModel):
    id:    int
    name:  str
    email: str

    class Config:
        from_attributes = True


class LoginResponse(BaseModel):
    access_token: str
    token_type:   str = "bearer"
    user:         UserOut


# ── Screening History ─────────────────────────────────────────────────────────

class HistoryCreate(BaseModel):
    title:           str
    resume_count:    int
    job_description: Optional[str]   = None
    avg_score:       Optional[float] = None
    top_score:       Optional[float] = None
    results:         Optional[list]  = None


class HistoryOut(BaseModel):
    id:              int
    title:           str
    resume_count:    int
    avg_score:       Optional[float] = None
    top_score:       Optional[float] = None
    job_description: Optional[str]   = None
    results:         Optional[list]  = None
    created_at:      datetime

    class Config:
        from_attributes = True
