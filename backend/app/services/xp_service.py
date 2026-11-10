from typing import Tuple
from app.config import settings


class XPService:
    @staticmethod
    def calculate_game_rewards(
        score: int,
        accuracy: float,
        difficulty: str,
        current_streak: int = 0,
    ) -> Tuple[int, int]:
        """
        Calculate XP and Coins awarded for completing a game.
        Returns: (xp_earned, coins_earned)
        """
        base_xp = settings.BASE_XP_PER_GAME
        
        # Accuracy multiplier: 80% accuracy -> 1.0, 100% accuracy -> 1.25, 50% accuracy -> 0.75
        acc_mult = max(0.5, accuracy / 80.0)
        
        # Difficulty factor
        diff_mult = {"Easy": 0.8, "Medium": 1.0, "Hard": 1.3, "Adaptive": 1.1}.get(difficulty, 1.0)
        
        # Streak bonus (e.g. 5 days = +25% bonus)
        streak_bonus = min(1.0, current_streak * settings.STREAK_BONUS_MULTIPLIER)
        
        # Performance bonus from score
        score_bonus = int(score / 20)

        total_xp = int((base_xp + score_bonus) * acc_mult * diff_mult * (1.0 + streak_bonus))
        total_coins = max(5, int(total_xp / 4))

        return total_xp, total_coins

    @staticmethod
    def compute_level_from_xp(total_xp: int) -> Tuple[int, int, int]:
        """
        Calculate level progression.
        Each level requires level * 250 XP.
        Returns: (current_level, current_level_xp, xp_for_next_level)
        """
        level = 1
        xp_needed = 250
        remaining_xp = total_xp

        while remaining_xp >= xp_needed:
            remaining_xp -= xp_needed
            level += 1
            xp_needed = level * 250

        return level, remaining_xp, xp_needed


xp_service = XPService()

