from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.user import User, UserStats
from app.models.game import Game
from app.models.challenge import DailyChallenge, ChallengeProgress
from app.models.reward import Reward
from app.schemas.challenge import DailyChallengeItem, DailyChallengeSummaryResponse
from app.services.challenge_service import challenge_service
from app.api.deps import get_current_user

router = APIRouter()


@router.get("/today", response_model=DailyChallengeSummaryResponse)
async def get_today_challenges(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    today = datetime.now(timezone.utc).date()
    challenges = await challenge_service.get_or_create_daily_challenges(db, today)

    # Fetch user progress for these challenges
    challenge_ids = [c.id for c in challenges]
    stmt_prog = select(ChallengeProgress).where(
        ChallengeProgress.user_id == current_user.id,
        ChallengeProgress.challenge_id.in_(challenge_ids),
    )
    progress_map = {p.challenge_id: p for p in (await db.execute(stmt_prog)).scalars().all()}

    items = []
    completed_count = 0

    for c in challenges:
        # Load game
        g_stmt = select(Game).where(Game.id == c.game_id)
        game = (await db.execute(g_stmt)).scalar_one_or_none()
        g_name = game.name if game else "Brain Game"
        g_slug = game.slug if game else "math-sprint"
        g_cat = game.category if game else "general"

        prog = progress_map.get(c.id)
        is_done = bool(prog and prog.completed)
        u_score = prog.score if prog else 0
        if is_done:
            completed_count += 1

        items.append(DailyChallengeItem(
            id=c.id,
            challenge_date=c.challenge_date,
            game_id=c.game_id,
            game_name=g_name,
            game_slug=g_slug,
            category=g_cat,
            difficulty=c.difficulty,
            target_metric=c.target_metric,
            target_value=c.target_value,
            reward_xp=c.reward_xp,
            reward_coins=c.reward_coins,
            completed=is_done,
            user_score=u_score,
        ))

    all_done = completed_count == len(challenges) and len(challenges) > 0

    # Check if bonus already claimed
    b_stmt = select(Reward).where(
        Reward.user_id == current_user.id,
        Reward.source == f"daily_bonus_{today.strftime('%Y-%m-%d')}",
    )
    bonus_claimed = bool((await db.execute(b_stmt)).scalar_one_or_none())

    return DailyChallengeSummaryResponse(
        challenge_date=today,
        challenges=items,
        total_challenges=len(items),
        completed_challenges=completed_count,
        all_completed=all_done,
        bonus_claimed=bonus_claimed,
    )


@router.post("/claim-bonus")
async def claim_daily_challenge_bonus(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    today = datetime.now(timezone.utc).date()
    challenges = await challenge_service.get_or_create_daily_challenges(db, today)
    challenge_ids = [c.id for c in challenges]

    # Verify all completed
    stmt = select(ChallengeProgress).where(
        ChallengeProgress.user_id == current_user.id,
        ChallengeProgress.challenge_id.in_(challenge_ids),
        ChallengeProgress.completed == True,
    )
    completed_progs = (await db.execute(stmt)).scalars().all()
    if len(completed_progs) < len(challenges):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="All daily challenges must be completed to claim bonus",
        )

    # Check if already claimed
    source_key = f"daily_bonus_{today.strftime('%Y-%m-%d')}"
    b_stmt = select(Reward).where(Reward.user_id == current_user.id, Reward.source == source_key)
    if (await db.execute(b_stmt)).scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Daily bonus already claimed")

    # Award bonus
    bonus_xp = 150
    bonus_coins = 100

    stats_stmt = select(UserStats).where(UserStats.user_id == current_user.id)
    stats = (await db.execute(stats_stmt)).scalar_one()
    stats.total_xp += bonus_xp
    stats.coins += bonus_coins

    reward = Reward(
        user_id=current_user.id,
        reward_type="chest",
        amount=bonus_coins,
        source=source_key,
    )
    db.add(reward)
    await db.commit()

    return {
        "message": "Daily bonus claimed successfully",
        "coins_awarded": bonus_coins,
        "xp_awarded": bonus_xp,
    }

