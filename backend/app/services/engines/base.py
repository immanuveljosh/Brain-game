from abc import ABC, abstractmethod
from typing import Dict, Any, List, Tuple, Optional


class BaseGameEngine(ABC):
    game_slug: str = "base"
    category: str = "general"

    @abstractmethod
    def generate_challenges(self, difficulty: str, seed: str, count: int = 10) -> List[Dict[str, Any]]:
        """Generate initial challenges server-side for the session"""
        pass

    @abstractmethod
    def validate_answer(
        self,
        challenge: Dict[str, Any],
        answer: Any,
        elapsed_ms: Optional[int] = None,
    ) -> Tuple[bool, int, str]:
        """
        Validate single answer against server challenge.
        Returns: (is_correct, score_awarded, feedback_message)
        """
        pass

    def evaluate_full_session(
        self,
        challenges: List[Dict[str, Any]],
        submitted_answers: List[Dict[str, Any]],
        duration_seconds: int,
    ) -> Tuple[int, float, Optional[float]]:
        """
        Server-side validation of entire session.
        Returns: (validated_score, validated_accuracy, average_reaction_time_ms)
        """
        if not submitted_answers:
            return 0, 0.0, None

        total_correct = 0
        total_score = 0
        reaction_times = []

        for idx, ans_data in enumerate(submitted_answers):
            if idx < len(challenges):
                chal = challenges[idx]
                is_correct, pts, _ = self.validate_answer(
                    chal,
                    ans_data.get("answer"),
                    ans_data.get("elapsed_ms"),
                )
                if is_correct:
                    total_correct += 1
                    total_score += pts
                if "elapsed_ms" in ans_data and ans_data["elapsed_ms"]:
                    reaction_times.append(ans_data["elapsed_ms"])

        accuracy = round((total_correct / len(submitted_answers)) * 100.0, 1)
        avg_reaction = round(sum(reaction_times) / len(reaction_times), 1) if reaction_times else None

        return total_score, accuracy, avg_reaction

