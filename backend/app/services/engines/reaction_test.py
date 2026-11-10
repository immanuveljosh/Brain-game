import random
from typing import Dict, Any, List, Tuple, Optional
from app.services.engines.base import BaseGameEngine


class ReactionTestEngine(BaseGameEngine):
    game_slug = "reaction-test"
    category = "focus"

    def generate_challenges(self, difficulty: str, seed: str, count: int = 3) -> List[Dict[str, Any]]:
        rng = random.Random(seed)
        challenges = []
        for i in range(count):
            delay_ms = rng.randint(1500, 4000)
            challenges.append({
                "round": i + 1,
                "delay_ms": delay_ms,
                "difficulty": difficulty,
            })
        return challenges

    def validate_answer(
        self,
        challenge: Dict[str, Any],
        answer: Any,
        elapsed_ms: Optional[int] = None,
    ) -> Tuple[bool, int, str]:
        # Answer is the reaction time in milliseconds
        try:
            rx_time = int(answer)
        except (ValueError, TypeError):
            return False, 0, "Invalid reaction timing"

        # Anti-cheat check: sub-100ms reaction time is considered false start or bot
        if rx_time < 100:
            return False, 0, "Tapped too early or automated click detected"

        # Scoring: higher points for faster reaction
        score = max(50, min(350, int(1000 - rx_time * 1.5)))
        return True, score, f"Reaction: {rx_time}ms"

