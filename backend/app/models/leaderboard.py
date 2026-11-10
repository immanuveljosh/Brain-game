from datetime import datetime, timezone
from sqlalchemy import (
    String,
    Integer,
    DateTime,
    ForeignKey,
    Index,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class LeaderboardSnapshot(Base):
    __tablename__ = "leaderboard_snapshots"
    __table_args__ = (
        Index("idx_lb_type_period_score", "leaderboard_type", "period", "score"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    leaderboard_type: Mapped[str] = mapped_column(String(50), index=True, nullable=False)  # global, weekly, monthly, category_<name>
    score: Mapped[int] = mapped_column(Integer, index=True, nullable=False)
    rank: Mapped[int] = mapped_column(Integer, default=0)
    period: Mapped[str] = mapped_column(String(50), index=True, default="all_time")  # all_time, 2026-W45, 2026-11
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user: Mapped["User"] = relationship("User")

