import random
from typing import Dict, Any, List, Tuple, Optional
from app.services.engines.base import BaseGameEngine


class MathSprintEngine(BaseGameEngine):
    game_slug = "math-sprint"
    category = "math"

    def generate_challenges(self, difficulty: str, seed: str, count: int = 15) -> List[Dict[str, Any]]:
        rng = random.Random(seed)
        challenges = []

        diff_mult = {"Easy": 1, "Medium": 2, "Hard": 3}.get(difficulty, 2)

        for step in range(count):
            operators = ["+", "-", "*"] if diff_mult > 1 else ["+", "-"]
            op = rng.choice(operators)

            if op == "+":
                a = rng.randint(5 * diff_mult, 25 * diff_mult)
                b = rng.randint(3 * diff_mult, 20 * diff_mult)
                ans = a + b
            elif op == "-":
                a = rng.randint(15 * diff_mult, 40 * diff_mult)
                b = rng.randint(2, a - 1)
                ans = a - b
            else:
                a = rng.randint(2, 9 + diff_mult)
                b = rng.randint(2, 9)
                ans = a * b

            # Distractor options
            options_set = {ans}
            while len(options_set) < 4:
                offset = rng.choice([-3, -2, -1, 1, 2, 3, 5, -5])
                opt = max(1, ans + offset)
                options_set.add(opt)

            options = list(options_set)
            rng.shuffle(options)

            challenges.append({
                "step": step,
                "prompt": f"{a} {op} {b} = ?",
                "correct_answer": ans,
                "options": options,
                "difficulty": difficulty,
            })

        return challenges

    def validate_answer(
        self,
        challenge: Dict[str, Any],
        answer: Any,
        elapsed_ms: Optional[int] = None,
    ) -> Tuple[bool, int, str]:
        # Anti-cheat check: impossible human reaction under 80ms for reading & answering
        if elapsed_ms is not None and elapsed_ms < 80:
            return False, 0, "Response suspiciously fast."

        try:
            user_val = int(answer)
        except (ValueError, TypeError):
            return False, 0, "Invalid answer format."

        expected = challenge.get("correct_answer")
        if user_val == expected:
            # Base 50 points + speed bonus
            speed_bonus = 0
            if elapsed_ms and elapsed_ms < 1500:
                speed_bonus = max(0, int((1500 - elapsed_ms) / 50))
            return True, 50 + speed_bonus, "Correct!"
        else:
            return False, 0, f"Incorrect. Correct answer was {expected}."

