from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, EmailStr, ConfigDict


class UserProfileUpdate(BaseModel):
    display_name: Optional[str] = None
    avatar: Optional[str] = None
    country: Optional[str] = None
    timezone: Optional[str] = None
    preferred_language: Optional[str] = None
    theme: Optional[str] = None
    notification_preferences: Optional[Dict[str, Any]] = None


class UserProfileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    display_name: str
    country: str
    timezone: str
    preferred_language: str
    theme: str
    notification_preferences: Dict[str, Any]


class UserStatsResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: int
    brain_score: int
    total_xp: int
    level: int
    coins: int
    current_streak: int
    longest_streak: int
    total_games_played: int
    total_play_time: int
    accuracy_average: float
    last_active_date: Optional[datetime]


class FullUserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    email: EmailStr
    avatar: str
    role: str
    created_at: datetime
    profile: Optional[UserProfileResponse] = None
    stats: Optional[UserStatsResponse] = None
