from datetime import datetime, timezone
from typing import List
from sqlalchemy import (
    String,
    Integer,
    DateTime,
    ForeignKey,
    JSON,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Achievement(Base):
    __tablename__ = "achievements"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    icon: Mapped[str] = mapped_column(String(50), default="Trophy")
    category: Mapped[str] = mapped_column(String(50), default="General")  # General, Memory, Logic, Math, Focus, Streak
    requirements: Mapped[dict] = mapped_column(JSON, default=dict)  # e.g. {"type": "games_played", "threshold": 100}
    reward_xp: Mapped[int] = mapped_column(Integer, default=100)
    reward_coins: Mapped[int] = mapped_column(Integer, default=50)
    rarity: Mapped[str] = mapped_column(String(20), default="Common")  # Common, Rare, Epic, Legendary

    user_achievements: Mapped[List["UserAchievement"]] = relationship("UserAchievement", back_populates="achievement", cascade="all, delete-orphan")


class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    achievement_id: Mapped[int] = mapped_column(Integer, ForeignKey("achievements.id", ondelete="CASCADE"), index=True, nullable=False)
    unlocked_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user: Mapped["User"] = relationship("User", back_populates="user_achievements")
    achievement: Mapped["Achievement"] = relationship("Achievement", back_populates="user_achievements")

