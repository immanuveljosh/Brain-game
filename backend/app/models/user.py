from datetime import datetime, timezone
from typing import Optional, List
from sqlalchemy import (
    String,
    Boolean,
    Integer,
    Float,
    DateTime,
    ForeignKey,
    JSON,
    Date,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    avatar: Mapped[str] = mapped_column(String(500), default="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=True)
    role: Mapped[str] = mapped_column(String(20), default="user")  # "user" or "admin"

    # Relationships
    profile: Mapped[Optional["UserProfile"]] = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    stats: Mapped[Optional["UserStats"]] = relationship("UserStats", back_populates="user", uselist=False, cascade="all, delete-orphan")
    sessions: Mapped[List["GameSession"]] = relationship("GameSession", back_populates="user", cascade="all, delete-orphan")
    results: Mapped[List["GameResult"]] = relationship("GameResult", back_populates="user", cascade="all, delete-orphan")
    user_achievements: Mapped[List["UserAchievement"]] = relationship("UserAchievement", back_populates="user", cascade="all, delete-orphan")
    challenge_progress: Mapped[List["ChallengeProgress"]] = relationship("ChallengeProgress", back_populates="user", cascade="all, delete-orphan")
    daily_activities: Mapped[List["DailyActivity"]] = relationship("DailyActivity", back_populates="user", cascade="all, delete-orphan")
    rewards: Mapped[List["Reward"]] = relationship("Reward", back_populates="user", cascade="all, delete-orphan")
    brain_score_history: Mapped[List["BrainScoreHistory"]] = relationship("BrainScoreHistory", back_populates="user", cascade="all, delete-orphan")


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    display_name: Mapped[str] = mapped_column(String(100), default="Mind Explorer")
    country: Mapped[str] = mapped_column(String(10), default="US")
    timezone: Mapped[str] = mapped_column(String(50), default="UTC")
    preferred_language: Mapped[str] = mapped_column(String(20), default="English")
    theme: Mapped[str] = mapped_column(String(20), default="dark")
    notification_preferences: Mapped[dict] = mapped_column(JSON, default=lambda: {
        "daily_reminder": True,
        "streak_alerts": True,
        "challenge_updates": True,
        "sound_effects": True,
    })

    user: Mapped["User"] = relationship("User", back_populates="profile")


class UserStats(Base):
    __tablename__ = "user_stats"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    brain_score: Mapped[int] = mapped_column(Integer, default=500)
    total_xp: Mapped[int] = mapped_column(Integer, default=0)
    level: Mapped[int] = mapped_column(Integer, default=1)
    coins: Mapped[int] = mapped_column(Integer, default=100)
    current_streak: Mapped[int] = mapped_column(Integer, default=0)
    longest_streak: Mapped[int] = mapped_column(Integer, default=0)
    total_games_played: Mapped[int] = mapped_column(Integer, default=0)
    total_play_time: Mapped[int] = mapped_column(Integer, default=0)  # total seconds
    accuracy_average: Mapped[float] = mapped_column(Float, default=0.0)
    last_active_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    user: Mapped["User"] = relationship("User", back_populates="stats")


class RevokedToken(Base):
    __tablename__ = "revoked_tokens"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    jti: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    token_type: Mapped[str] = mapped_column(String(20), default="access")
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

