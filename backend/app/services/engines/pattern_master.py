import random
from typing import Dict, Any, List, Tuple, Optional
from app.services.engines.base import BaseGameEngine


class PatternMasterEngine(BaseGameEngine):
    game_slug = "pattern-master"
    category = "logic"

    PATTERNS_DB = [
        {"seq": ["▲", "■", "●", "▲", "■", "?"], "options": ["●", "▲", "◆", "★"], "ans": 0, "exp": "Repeating shapes"},
        {"seq": ["2", "4", "8", "16", "32", "?"], "options": ["48", "64", "56", "72"], "ans": 1, "exp": "Double each step"},
        {"seq": ["★", "★★", "★★★", "★★★★", "?"], "options": ["★★★★★", "★★★", "★★★★★★", "★"], "ans": 0, "exp": "+1 star"},
        {"seq": ["1", "1", "2", "3", "5", "8", "?"], "options": ["11", "12", "13", "15"], "ans": 2, "exp": "Fibonacci"},
        {"seq": ["◆", "◇", "◆", "◇", "◆", "?"], "options": ["◇", "◆", "●", "■"], "ans": 0, "exp": "Alternating fill"},
        {"seq": ["3", "6", "12", "24", "48", "?"], "options": ["72", "84", "96", "108"], "ans": 2, "exp": "Double previous"},
        {"seq": ["100", "95", "85", "70", "50", "?"], "options": ["25", "30", "35", "20"], "ans": 0, "exp": "-5, -10, -15, -20, -25"},
    ]

    def generate_challenges(self, difficulty: str, seed: str, count: int = 6) -> List[Dict[str, Any]]:
        rng = random.Random(seed)
        shuffled = list(self.PATTERNS_DB)
        rng.shuffle(shuffled)
        return shuffled[:count]

    def validate_answer(
        self,
        challenge: Dict[str, Any],
        answer: Any,
        elapsed_ms: Optional[int] = None,
    ) -> Tuple[bool, int, str]:
        try:
            chosen_idx = int(answer)
        except (ValueError, TypeError):
            return False, 0, "Invalid choice"

        expected = challenge.get("ans")
        if chosen_idx == expected:
            return True, 80, "Pattern solved correctly!"
        return False, 0, f"Incorrect. Rule was: {challenge.get('exp')}"

