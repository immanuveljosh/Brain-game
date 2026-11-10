import random
from typing import Dict, Any, List, Tuple, Optional
from app.services.engines.base import BaseGameEngine


class ColorConfusionEngine(BaseGameEngine):
    game_slug = "color-confusion"
    category = "focus"

    COLORS = ["RED", "BLUE", "GREEN", "YELLOW", "PURPLE"]

    def generate_challenges(self, difficulty: str, seed: str, count: int = 15) -> List[Dict[str, Any]]:
        rng = random.Random(seed)
        challenges = []
        for i in range(count):
            word = rng.choice(self.COLORS)
            # 80% chance of Stroop mismatch
            if rng.random() < 0.8:
                ink = rng.choice([c for c in self.COLORS if c != word])
            else:
                ink = word

            other_options = [c for c in self.COLORS if c != ink]
            rng.shuffle(other_options)
            options = [ink] + other_options[:3]
            rng.shuffle(options)

            challenges.append({
                "step": i,
                "word": word,
                "ink": ink,
                "options": options,
            })
        return challenges

    def validate_answer(
        self,
        challenge: Dict[str, Any],
        answer: Any,
        elapsed_ms: Optional[int] = None,
    ) -> Tuple[bool, int, str]:
        # User must match the INK color, not the word text
        if str(answer).strip().upper() == challenge.get("ink"):
            return True, 50, "Correct ink identified!"
        return False, 0, f"Incorrect. The true ink color was {challenge.get('ink')}."

