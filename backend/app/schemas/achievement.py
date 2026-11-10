from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, ConfigDict


class AchievementResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str
    description: str
    icon: str
    category: str
    reward_xp: int
    reward_coins: int
    rarity: str
    unlocked: bool = False
    unlocked_at: Optional[datetime] = None
    progress: int = 0
    max_progress: int = 1
