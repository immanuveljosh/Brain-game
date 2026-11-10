from datetime import date, datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, ConfigDict


class DailyChallengeItem(BaseModel):
    id: int
    challenge_date: date
    game_id: int
    game_name: str
    game_slug: str
    category: str
    difficulty: str
    target_metric: str
    target_value: int
    reward_xp: int
    reward_coins: int
    completed: bool = False
    user_score: int = 0


class DailyChallengeSummaryResponse(BaseModel):
    challenge_date: date
    challenges: List[DailyChallengeItem]
    total_challenges: int
    completed_challenges: int
    all_completed: bool
    bonus_claimed: bool
    bonus_xp: int = 150
    bonus_coins: int = 100


class DailyActivityItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    activity_date: date
    games_played: int
    xp_earned: int
    play_time: int
    accuracy: float
