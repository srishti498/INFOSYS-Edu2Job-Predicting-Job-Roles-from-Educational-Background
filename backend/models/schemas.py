from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, field_validator

DEGREE_VALUES = ["High School", "Diploma", "Bachelors", "Masters", "PhD"]
BRANCH_VALUES = [
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
COLLEGE_TYPE_VALUES = ["Tier 1", "Tier 2", "Tier 3"]


class PredictRequest(BaseModel):
    # Core Education Fields (30% weight)
    degree: Literal["High School", "Diploma", "Bachelors", "Masters", "PhD"] = Field(
        description="Highest degree obtained"
    )
    branch: str = Field(min_length=2, max_length=80, description="Branch of study")
    specialization: str = Field(max_length=100, description="Specialization/Focus area (10% weight)")
    
    # Academic Performance (25% weight)
    cgpa: float = Field(ge=0, le=10, description="CGPA scored (0-10) - 15% weight")
    tenth_percentage: float = Field(ge=0, le=100, description="10th grade percentage (0-100) - 5% weight")
    twelfth_percentage: float = Field(ge=0, le=100, description="12th grade percentage (0-100) - 5% weight")
    
    # Career & Academic Context (20% weight)
    graduation_year: int = Field(ge=2000, le=2100, description="Year of graduation - 5% weight")
    backlogs: int = Field(ge=0, description="Number of backlogs - penalty if >0")
    college_type: Literal["Tier 1", "Tier 2", "Tier 3"] = Field(description="College tier - 10% weight")
    major_subject_focus: str = Field(max_length=200, description="Major subjects (e.g., DSA, DBMS, ML) - 10% weight")

    @field_validator("degree", "branch", "specialization")
    @classmethod
    def validate_non_empty(cls, value: str) -> str:
        if not value or not value.strip():
            raise ValueError("This field cannot be empty")
        return value.strip()

    @field_validator("graduation_year")
    @classmethod
    def validate_graduation_year(cls, value: int) -> int:
        if value < 2000 or value > 2100:
            raise ValueError("Graduation year must be between 2000 and 2100")
        return value


class PredictedRole(BaseModel):
    role: str = Field(description="Job role name")
    confidence: float = Field(ge=0, le=100, description="Confidence percentage (0-100)")
    reason: str = Field(description="Explanation for why this role was predicted")
    influences: list[str] = Field(default_factory=list, description="Factors that influenced this prediction")


class ProfileWeakness(BaseModel):
    category: str = Field(description="Category of weakness (e.g., 'Academic', 'Specialization')")
    detail: str = Field(description="Details about the weakness")
    improvement_suggestion: str = Field(description="How to improve this")


class PredictResponse(BaseModel):
    mode: Literal["rule_based", "ml_placeholder"]
    predicted_roles: list[PredictedRole]
    profile_strength_score: float = Field(
        ge=0, le=100,
        description="Overall profile strength (0-100)"
    )
    top_role_confidence: float = Field(
        ge=0, le=100,
        description="Confidence of top predicted role"
    )
    weights_breakdown: dict[str, float] = Field(
        default_factory=dict,
        description="Weight distribution in prediction"
    )
    academic_consistency_bonus: float = Field(
        default=0, description="Bonus for good academic progression"
    )
    weaknesses: list[ProfileWeakness] = Field(
        default_factory=list, description="Identified profile weaknesses"
    )
    improvement_suggestions: list[str] = Field(
        default_factory=list, description="Suggestions to improve profile"
    )
    required_skills: dict[str, list[str]] = Field(
        default_factory=dict,
        description="Most important skills grouped by predicted role",
    )
    recommended_additional_roles: list[str] = Field(
        default_factory=list,
        description="Related roles to explore next",
    )
    salary_ranges: dict[str, str] = Field(
        default_factory=dict,
        description="Estimated salary ranges grouped by role",
    )
    top_hiring_companies: dict[str, list[str]] = Field(
        default_factory=dict,
        description="Top companies hiring for each role",
    )


class HistoryItem(BaseModel):
    id: int
    profile: PredictRequest
    result: PredictResponse
    created_at: datetime


class HistoryResponse(BaseModel):
    items: list[HistoryItem]
