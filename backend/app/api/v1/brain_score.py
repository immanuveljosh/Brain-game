from fastapi import APIRouter, Depends
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.user import User, UserStats
from app.models.brain_score import BrainScoreHistory
from app.services.scoring_service import scoring_service
from app.api.deps import get_current_user

router = APIRouter()


@router.get("/")
async def get_brain_score_breakdown(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(UserStats).where(UserStats.user_id == current_user.id)
    stats = (await db.execute(stmt)).scalar_one_or_none()
    score = stats.brain_score if stats else 500

    category_scores = await scoring_service.compute_category_scores(db, current_user.id)
    estimated_age = scoring_service.calculate_estimated_brain_age(score)

    return {
        "brain_score": score,
        "max_score": 1000,
        "estimated_brain_age": estimated_age,
        "tier": "Mind Explorer" if score < 800 else "Grandmaster",
        "category_scores": category_scores,
    }


@router.get("/history")
async def get_brain_score_history(
    limit: int = 14,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(BrainScoreHistory)
        .where(BrainScoreHistory.user_id == current_user.id)
        .order_by(desc(BrainScoreHistory.recorded_at))
        .limit(limit)
    )
    rows = list((await db.execute(stmt)).scalars().all())
    rows.reverse()
    return [
        {
            "id": r.id,
            "total_score": r.total_score,
            "memory": r.memory_score,
            "logic": r.logic_score,
            "math": r.math_score,
            "focus": r.focus_score,
            "visual": r.visual_score,
            "language": r.language_score,
            "date": r.recorded_at.strftime("%Y-%m-%d"),
        }
        for r in rows
    ]

