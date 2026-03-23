from typing import Protocol

from models.schemas import PredictRequest, PredictedRole

BASE_SCORE = {
    "Software Developer": 12,
    "Data Analyst": 11,
    "Data Scientist": 10,
    "Business Analyst": 8,
    "Cloud Engineer": 8,
    "Cybersecurity Analyst": 8,
    "QA Engineer": 7,
    "UI/UX Designer": 7,
}


class Predictor(Protocol):
    def predict(self, payload: PredictRequest) -> list[PredictedRole]:
        ...


class RuleBasedPredictor:
    mode = "rule_based"

    def predict(self, payload: PredictRequest) -> list[PredictedRole]:
        scores = {role: value for role, value in BASE_SCORE.items()}
        skills = set(payload.skills)

        if payload.education in {"Bachelors", "Masters", "PhD"}:
            scores["Software Developer"] += 7
            scores["Data Analyst"] += 4
        if payload.education in {"Masters", "PhD"}:
            scores["Data Scientist"] += 8
        if payload.education == "Diploma":
            scores["QA Engineer"] += 6

        stream = payload.stream.lower()
        if any(token in stream for token in ["computer", "it", "software"]):
            scores["Software Developer"] += 9
            scores["Cloud Engineer"] += 4
        if any(token in stream for token in ["data", "statistics", "math"]):
            scores["Data Scientist"] += 7
            scores["Data Analyst"] += 8
        if any(token in stream for token in ["business", "commerce"]):
            scores["Business Analyst"] += 9
            scores["Data Analyst"] += 5
        if "design" in stream:
            scores["UI/UX Designer"] += 12

        if {"python", "pandas", "numpy"} & skills:
            scores["Data Scientist"] += 7
            scores["Data Analyst"] += 3
        if {"machine learning", "deep learning", "tensorflow", "pytorch"} & skills:
            scores["Data Scientist"] += 10
        if {"sql", "power bi", "tableau", "excel"} & skills:
            scores["Data Analyst"] += 10
            scores["Business Analyst"] += 4
        if {"javascript", "react", "node", "java", "c++"} & skills:
            scores["Software Developer"] += 9
        if {"aws", "azure", "docker", "kubernetes"} & skills:
            scores["Cloud Engineer"] += 10
        if {"networking", "cybersecurity", "security", "ethical hacking"} & skills:
            scores["Cybersecurity Analyst"] += 10
        if {"selenium", "cypress", "manual testing", "testing"} & skills:
            scores["QA Engineer"] += 10
        if {"figma", "ux", "ui", "wireframing"} & skills:
            scores["UI/UX Designer"] += 9

        if payload.cgpa >= 9:
            scores = {role: value + 5 for role, value in scores.items()}
        elif payload.cgpa >= 8:
            scores = {role: value + 3 for role, value in scores.items()}
        elif payload.cgpa < 6:
            scores = {role: max(1, value - 2) for role, value in scores.items()}

        scores["Software Developer"] += payload.internships * 2
        scores["Data Analyst"] += payload.internships * 2
        scores["Data Scientist"] += payload.internships
        scores["Cloud Engineer"] += payload.certifications
        scores["Cybersecurity Analyst"] += payload.certifications
        scores["Data Analyst"] += payload.certifications

        total = sum(max(score, 1) for score in scores.values())
        ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)[:3]

        return [
            PredictedRole(name=role, confidence=round((max(score, 1) / total) * 100, 1))
            for role, score in ranked
        ]


class MLReadyPredictorFacade:
    """Facade that keeps API stable while allowing ML predictor plug-in later."""

    def __init__(self) -> None:
        self.rule_predictor = RuleBasedPredictor()

    def predict(self, payload: PredictRequest) -> tuple[str, list[PredictedRole]]:
        # Future behavior:
        # if model_registry.has_active_model("edu2job"):
        #     return "ml_model", ml_predictor.predict(payload)
        return self.rule_predictor.mode, self.rule_predictor.predict(payload)
