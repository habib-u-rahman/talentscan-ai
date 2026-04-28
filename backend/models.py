from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class User(Base):
    __tablename__ = "users"

    id                 = Column(Integer, primary_key=True, index=True)
    name               = Column(String(120), nullable=False)
    email              = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password    = Column(String(255), nullable=False)
    created_at         = Column(DateTime(timezone=True), server_default=func.now())
    is_verified        = Column(Boolean, default=False, nullable=False)
    verification_token = Column(String(64), unique=True, nullable=True)

    history = relationship(
        "ScreeningHistory",
        back_populates="user",
        cascade="all, delete-orphan",
        order_by="ScreeningHistory.created_at.desc()",
    )


class ScreeningHistory(Base):
    __tablename__ = "screening_history"

    id              = Column(Integer, primary_key=True, index=True)
    user_id         = Column(Integer, ForeignKey("users.id"), nullable=False)
    title           = Column(String(255), nullable=False)
    resume_count    = Column(Integer, default=0)
    job_description = Column(Text, nullable=True)
    avg_score       = Column(Float, nullable=True)
    top_score       = Column(Float, nullable=True)
    results_json    = Column(Text, nullable=True)
    created_at      = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="history")


class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id         = Column(Integer, primary_key=True, index=True)
    user_id    = Column(Integer, ForeignKey("users.id"), nullable=False)
    token      = Column(String(64), unique=True, index=True, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    used       = Column(Boolean, default=False, nullable=False)

    user = relationship("User")


class ResumeEmbedding(Base):
    __tablename__ = "resume_embeddings"

    id             = Column(Integer, primary_key=True, index=True)
    user_id        = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    filename       = Column(String(255))
    name           = Column(String(255))
    chunk_text     = Column(Text)
    embedding_json = Column(Text)          # JSON array of 384 floats
    score          = Column(Float, nullable=True)
    skills_json    = Column(Text, nullable=True)
    missing_json   = Column(Text, nullable=True)
    created_at     = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")
