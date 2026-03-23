from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, field_validator

EDUCATION_VALUES = ["High School", "Diploma", "Bachelors", "Masters", "PhD"]
STREAM_VALUES = [
    "Computer Science",
    "Information Technology",
    "Data Science",
    "Electronics",
    "Mechanical",
    "Civil",
    "Business",
    "Commerce",
    "Design",
    "Other",
]


class PredictRequest(BaseModel):
    education: Literal["High School", "Diploma", "Bachelors", "Masters", "PhD"]
    stream: str = Field(min_length=2, max_length=80)
    cgpa: float = Field(ge=0, le=10)
    internships: int = Field(ge=0, le=20)
    certifications: int = Field(ge=0, le=30)
    skills: list[str] = Field(min_length=1, max_length=30)

    @field_validator("skills")
    @classmethod
    def normalize_skills(cls, value: list[str]) -> list[str]:
        normalized = sorted({item.strip().lower() for item in value if item.strip()})
        if not normalized:
            raise ValueError("At least one skill is required")
        return normalized


class PredictedRole(BaseModel):
    name: str
    confidence: float = Field(ge=0, le=100)


class ImprovementTip(BaseModel):
    title: str
    detail: str


class PredictResponse(BaseModel):
    mode: Literal["rule_based", "ml_placeholder"]
    roles: list[PredictedRole]
    skill_suggestions: list[str]
    recommendations: list[ImprovementTip]


class HistoryItem(BaseModel):
    id: int
    profile: PredictRequest
    result: PredictResponse
    created_at: datetime


class HistoryResponse(BaseModel):
    items: list[HistoryItem]
