import random
import string
from datetime import datetime, timezone
from typing import Optional, Tuple
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from app.models.social import MultiplayerRoom
from app.models.user import User


def generate_room_code() -> str:
    return "".join(random.choices(string.ascii_uppercase + string.digits, k=6))


class MultiplayerService:
    @staticmethod
    async def create_room(
        db: AsyncSession,
        host_id: int,
        game_slug: str = "math-sprint",
    ) -> MultiplayerRoom:
        code = generate_room_code()
        room = MultiplayerRoom(
            room_code=code,
            host_id=host_id,
            game_slug=game_slug,
            status="waiting",
        )
        db.add(room)
        await db.flush()
        return room

    @staticmethod
    async def join_room(
        db: AsyncSession,
        guest_id: int,
        room_code: str,
    ) -> MultiplayerRoom:
        stmt = select(MultiplayerRoom).where(MultiplayerRoom.room_code == room_code.upper().strip())
        room = (await db.execute(stmt)).scalar_one_or_none()
        if not room:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
        if room.host_id == guest_id:
            return room
        if room.guest_id and room.guest_id != guest_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Room is already full")

        room.guest_id = guest_id
        room.status = "ready"
        await db.flush()
        return room

    @staticmethod
    async def submit_room_score(
        db: AsyncSession,
        user_id: int,
        room_id: str,
        score: int,
    ) -> MultiplayerRoom:
        stmt = select(MultiplayerRoom).where(MultiplayerRoom.id == room_id)
        room = (await db.execute(stmt)).scalar_one_or_none()
        if not room:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")

        if room.host_id == user_id:
            room.host_score = score
        elif room.guest_id == user_id:
            room.guest_score = score
        else:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a participant in this room")

        # If both submitted or one finished
        if room.host_score > 0 and room.guest_score > 0:
            room.status = "completed"
            room.completed_at = datetime.now(timezone.utc)
            if room.host_score > room.guest_score:
                room.winner_id = room.host_id
            elif room.guest_score > room.host_score:
                room.winner_id = room.guest_id

        await db.flush()
        return room


multiplayer_service = MultiplayerService()

