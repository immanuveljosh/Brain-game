from typing import List, Optional
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User, UserProfile, UserStats
from app.models.social import Friendship
from app.schemas.leaderboard import LeaderboardUserEntry, LeaderboardResponse
from app.redis import cache


class LeaderboardService:
    @staticmethod
    async def get_leaderboard(
        db: AsyncSession,
        current_user_id: Optional[int],
        leaderboard_type: str = "global",
        period: str = "all_time",
        limit: int = 50,
        offset: int = 0,
    ) -> LeaderboardResponse:
        cache_key = f"lb:{leaderboard_type}:{period}:{limit}:{offset}"
        cached = await cache.get(cache_key)
        if cached:
            entries = [LeaderboardUserEntry(**e) for e in cached.get("entries", [])]
            # Mark is_current_user dynamically
            for e in entries:
                if current_user_id and e.user_id == current_user_id:
                    e.is_current_user = True
            return LeaderboardResponse(
                leaderboard_type=leaderboard_type,
                period=period,
                entries=entries,
                total_participants=cached.get("total_participants", len(entries)),
            )

        if leaderboard_type == "friends" and current_user_id:
            # Query friends + current user
            f_stmt = select(Friendship.friend_id).where(
                Friendship.user_id == current_user_id,
                Friendship.status == "accepted",
            )
            friend_ids = list((await db.execute(f_stmt)).scalars().all())
            friend_ids.append(current_user_id)

            stmt = (
                select(User, UserProfile, UserStats)
                .outerjoin(UserProfile, User.id == UserProfile.user_id)
                .outerjoin(UserStats, User.id == UserStats.user_id)
                .where(User.id.in_(friend_ids), User.is_active == True)
                .order_by(desc(UserStats.brain_score))
                .limit(limit)
                .offset(offset)
            )
        else:
            # Global
            stmt = (
                select(User, UserProfile, UserStats)
                .outerjoin(UserProfile, User.id == UserProfile.user_id)
                .outerjoin(UserStats, User.id == UserStats.user_id)
                .where(User.is_active == True)
                .order_by(desc(UserStats.brain_score))
                .limit(limit)
                .offset(offset)
            )

        res = await db.execute(stmt)
        rows = res.all()

        entries = []
        for idx, (user, profile, stats) in enumerate(rows):
            rank = offset + idx + 1
            disp_name = profile.display_name if profile else user.username
            b_score = stats.brain_score if stats else 500
            lvl = stats.level if stats else 1
            strk = stats.current_streak if stats else 0
            is_me = bool(current_user_id and user.id == current_user_id)

            entries.append(LeaderboardUserEntry(
                rank=rank,
                user_id=user.id,
                username=user.username,
                display_name=disp_name,
                avatar=user.avatar,
                score=b_score,
                level=lvl,
                streak=strk,
                is_current_user=is_me,
            ))

        # Cache for 60 seconds
        await cache.set(
            cache_key,
            {
                "entries": [e.model_dump() for e in entries],
                "total_participants": len(entries),
            },
            expire_seconds=60,
        )

        curr_entry = next((e for e in entries if e.is_current_user), None)

        return LeaderboardResponse(
            leaderboard_type=leaderboard_type,
            period=period,
            entries=entries,
            current_user_entry=curr_entry,
            total_participants=len(entries),
        )


leaderboard_service = LeaderboardService()

