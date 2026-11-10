from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, EmailStr


class AdminUserUpdate(BaseModel):
    is_active: Optional[bool] = None
    is_verified: Optional[bool] = None
    role: Optional[str] = None
    avatar: Optional[str] = None


class AdminSystemStats(BaseModel):
    total_users: int
    active_users: int
    total_games: int
    total_sessions_played: int
    total_challenges_completed: int
    average_brain_score: float
    system_health: str = "healthy"
    database_status: str = "connected"
    redis_status: str = "active"

