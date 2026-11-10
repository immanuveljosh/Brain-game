from datetime import datetime, timezone
from sqlalchemy import (
    Integer,
    Float,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class BrainScoreHistory(Base):
    __tablename__ = "brain_score_history"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    total_score: Mapped[int] = mapped_column(Integer, nullable=False)
    memory_score: Mapped[int] = mapped_column(Integer, default=500)
    logic_score: Mapped[int] = mapped_column(Integer, default=500)
    math_score: Mapped[int] = mapped_column(Integer, default=500)
    speed_score: Mapped[int] = mapped_column(Integer, default=500)
    focus_score: Mapped[int] = mapped_column(Integer, default=500)
    visual_score: Mapped[int] = mapped_column(Integer, default=500)
    language_score: Mapped[int] = mapped_column(Integer, default=500)
    recorded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True)

    user: Mapped["User"] = relationship("User", back_populates="brain_score_history")

