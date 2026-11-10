import uuid
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
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Game(Base):
    __tablename__ = "games"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    category: Mapped[str] = mapped_column(String(50), index=True, nullable=False)  # memory, logic, math, focus, visual, language
    description: Mapped[str] = mapped_column(Text, default="")
    difficulty: Mapped[str] = mapped_column(String(20), default="Medium")  # Easy, Medium, Hard, Adaptive
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    configuration: Mapped[dict] = mapped_column(JSON, default=dict)

    sessions: Mapped[List["GameSession"]] = relationship("GameSession", back_populates="game", cascade="all, delete-orphan")
    results: Mapped[List["GameResult"]] = relationship("GameResult", back_populates="game", cascade="all, delete-orphan")


class GameSession(Base):
    __tablename__ = "game_sessions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    game_id: Mapped[int] = mapped_column(Integer, ForeignKey("games.id", ondelete="CASCADE"), index=True, nullable=False)
    difficulty: Mapped[str] = mapped_column(String(20), default="Medium")
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    duration_seconds: Mapped[int] = mapped_column(Integer, default=0)
    score: Mapped[int] = mapped_column(Integer, default=0)
    accuracy: Mapped[float] = mapped_column(Float, default=0.0)
    result_data: Mapped[dict] = mapped_column(JSON, default=dict)
    status: Mapped[str] = mapped_column(String(20), default="in_progress")  # in_progress, completed, cancelled
    seed: Mapped[str] = mapped_column(String(64), default=lambda: str(uuid.uuid4().hex[:16]))

    user: Mapped["User"] = relationship("User", back_populates="sessions")
    game: Mapped["Game"] = relationship("Game", back_populates="sessions")
    result: Mapped[Optional["GameResult"]] = relationship("GameResult", back_populates="session", uselist=False, cascade="all, delete-orphan")


class GameResult(Base):
    __tablename__ = "game_results"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    game_id: Mapped[int] = mapped_column(Integer, ForeignKey("games.id", ondelete="CASCADE"), index=True, nullable=False)
    session_id: Mapped[str] = mapped_column(String(36), ForeignKey("game_sessions.id", ondelete="CASCADE"), unique=True, nullable=False)
    score: Mapped[int] = mapped_column(Integer, nullable=False)
    accuracy: Mapped[float] = mapped_column(Float, default=0.0)
    reaction_time: Mapped[Optional[float]] = mapped_column(Float, nullable=True)  # in milliseconds or seconds
    difficulty: Mapped[str] = mapped_column(String(20), default="Medium")
    xp_earned: Mapped[int] = mapped_column(Integer, default=50)
    coins_earned: Mapped[int] = mapped_column(Integer, default=10)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True)

    user: Mapped["User"] = relationship("User", back_populates="results")
    game: Mapped["Game"] = relationship("Game", back_populates="results")
    session: Mapped["GameSession"] = relationship("GameSession", back_populates="result")

