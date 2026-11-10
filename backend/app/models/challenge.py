from datetime import datetime, date, timezone
from typing import List, Optional
from sqlalchemy import (
    String,
    Boolean,
    Integer,
    Float,
    DateTime,
    Date,
    ForeignKey,
    JSON,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class DailyChallenge(Base):
    __tablename__ = "daily_challenges"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    challenge_date: Mapped[date] = mapped_column(Date, index=True, nullable=False)
    game_id: Mapped[int] = mapped_column(Integer, ForeignKey("games.id", ondelete="CASCADE"), nullable=False)
    difficulty: Mapped[str] = mapped_column(String(20), default="Medium")
    target_metric: Mapped[str] = mapped_column(String(50), default="score")  # score, accuracy, completion
    target_value: Mapped[int] = mapped_column(Integer, default=500)
    configuration: Mapped[dict] = mapped_column(JSON, default=dict)
    reward_xp: Mapped[int] = mapped_column(Integer, default=50)
    reward_coins: Mapped[int] = mapped_column(Integer, default=25)

    progress: Mapped[List["ChallengeProgress"]] = relationship("ChallengeProgress", back_populates="challenge", cascade="all, delete-orphan")


class ChallengeProgress(Base):
    __tablename__ = "challenge_progress"
    __table_args__ = (UniqueConstraint("user_id", "challenge_id", name="uq_user_challenge"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    challenge_id: Mapped[int] = mapped_column(Integer, ForeignKey("daily_challenges.id", ondelete="CASCADE"), index=True, nullable=False)
    completed: Mapped[bool] = mapped_column(Boolean, default=False)
    score: Mapped[int] = mapped_column(Integer, default=0)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    user: Mapped["User"] = relationship("User", back_populates="challenge_progress")
    challenge: Mapped["DailyChallenge"] = relationship("DailyChallenge", back_populates="progress")


class DailyActivity(Base):
    __tablename__ = "daily_activity"
    __table_args__ = (UniqueConstraint("user_id", "activity_date", name="uq_user_activity_date"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    activity_date: Mapped[date] = mapped_column(Date, index=True, nullable=False)
    games_played: Mapped[int] = mapped_column(Integer, default=0)
    xp_earned: Mapped[int] = mapped_column(Integer, default=0)
    play_time: Mapped[int] = mapped_column(Integer, default=0)  # seconds
    accuracy: Mapped[float] = mapped_column(Float, default=0.0)

    user: Mapped["User"] = relationship("User", back_populates="daily_activities")

