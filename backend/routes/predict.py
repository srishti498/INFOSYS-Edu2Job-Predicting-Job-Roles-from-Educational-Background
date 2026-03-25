from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models.schemas import (
    HistoryResponse,
    PredictRequest,
    PredictResponse,
    ProfileWeakness,
)
from services.history_service import HistoryService
from services.predictor import MLReadyPredictorFacade
from services.role_insights import build_role_insights

router = APIRouter(prefix="/predict", tags=["predict"])
predictor = MLReadyPredictorFacade()
history_service = HistoryService()


def _calculate_profile_strength(request: PredictRequest) -> float:
    """
    Calculate overall profile strength score (0-100) based on all academic metrics.
    """
    strength = 0.0
    
    # CGPA contribution (0-20 points)
    strength += (request.cgpa / 10) * 20
    
    # 12th percentage contribution (0-15 points)
    strength += (request.twelfth_percentage / 100) * 15
    
    # 10th percentage contribution (0-15 points)
    strength += (request.tenth_percentage / 100) * 15
    
    # College type bonus (0-15 points)
    college_bonus = {"Tier 1": 15, "Tier 2": 10, "Tier 3": 5}.get(request.college_type, 5)
    strength += college_bonus
    
    # Backlogs penalty (0-20 points, reduced by backlogs)
    backlog_penalty = max(0, 20 - (request.backlogs * 10))
    strength += backlog_penalty
    
    # Specialization bonus (0-10 points)
    strength += 10 if request.specialization.strip() else 0
    
    # Major subject focus bonus (0-10 points)
    strength += 10 if request.major_subject_focus.strip() else 0
    
    return min(strength, 100.0)


def _identify_weaknesses(request: PredictRequest) -> list[ProfileWeakness]:
    """
    Identify profile weaknesses and suggest improvements.
    """
    weaknesses = []
    
    # Check CGPA
    if request.cgpa < 7.0:
        weaknesses.append(
            ProfileWeakness(
                category="Academic Performance",
                detail=f"CGPA {request.cgpa} is below the 7.0 threshold",
                improvement_suggestion="Focus on improving CGPA through consistent performance",
            )
        )
    
    # Check 10th percentage
    if request.tenth_percentage < 70:
        weaknesses.append(
            ProfileWeakness(
                category="Foundation Academics",
                detail=f"10th percentage {request.tenth_percentage} indicates weak foundation",
                improvement_suggestion="Revisit core concepts from 10th grade",
            )
        )
    
    # Check 12th percentage
    if request.twelfth_percentage < 70:
        weaknesses.append(
            ProfileWeakness(
                category="Higher Secondary",
                detail=f"12th percentage {request.twelfth_percentage} is below expectation",
                improvement_suggestion="Strengthen fundamentals in core subjects",
            )
        )
    
    # Check backlogs
    if request.backlogs > 0:
        weaknesses.append(
            ProfileWeakness(
                category="Academic Status",
                detail=f"You have {request.backlogs} backlog(s)",
                improvement_suggestion="Clear all backlogs as soon as possible to improve profile",
            )
        )
    
    # Check specialization
    if not request.specialization.strip():
        weaknesses.append(
            ProfileWeakness(
                category="Career Focus",
                detail="No specialization mentioned",
                improvement_suggestion="Define a clear specialization to strengthen profile",
            )
        )
    
    # Check academic consistency
    consistency = request.twelfth_percentage - request.tenth_percentage
    if consistency < -5:
        weaknesses.append(
            ProfileWeakness(
                category="Academic Consistency",
                detail=f"Declining grades from 10th ({request.tenth_percentage}) to 12th ({request.twelfth_percentage})",
                improvement_suggestion="Show upward trend in CGPA to demonstrate improvement",
            )
        )
    
    return weaknesses


@router.post("", response_model=PredictResponse)
def predict(payload: PredictRequest, db: Session = Depends(get_db)) -> PredictResponse:
    """
    Predict job roles based on structured educational data.
    """
    # Run prediction
    mode, predicted_roles = predictor.predict(payload)
    
    # Calculate profile strength
    profile_strength = _calculate_profile_strength(payload)
    
    # Identify weaknesses
    weaknesses = _identify_weaknesses(payload)
    
    # Build improvement suggestions
    improvement_suggestions = []
    if payload.backlogs > 0:
        improvement_suggestions.append(f"Clear {payload.backlogs} backlog(s) to improve competitiveness")
    if payload.cgpa < 8.0:
        improvement_suggestions.append("Aim for CGPA ≥ 8.0 for premium roles")
    if not payload.major_subject_focus.strip():
        improvement_suggestions.append("Develop expertise in core subjects (DSA, DBMS, Database Design)")
    if payload.college_type == "Tier 3":
        improvement_suggestions.append("Strengthen your profile with internships and certifications")
    
    # Build response
    role_names = [item.role for item in predicted_roles]
    role_insights = build_role_insights(role_names)

    result = PredictResponse(
        mode=mode,
        predicted_roles=predicted_roles,
        profile_strength_score=profile_strength,
        top_role_confidence=predicted_roles[0].confidence if predicted_roles else 0,
        weights_breakdown={
            "degree_branch": 30,
            "specialization": 10,
            "cgpa": 15,
            "twelfth_percentage": 5,
            "tenth_percentage": 5,
            "graduation_year": 5,
            "college_type": 10,
            "major_subject_focus": 10,
            "academic_consistency": 10,
        },
        weaknesses=weaknesses,
        improvement_suggestions=improvement_suggestions,
        required_skills=role_insights["required_skills"],
        recommended_additional_roles=role_insights["recommended_additional_roles"],
        salary_ranges=role_insights["salary_ranges"],
        top_hiring_companies=role_insights["top_hiring_companies"],
    )
    
    # Save to history
    history_service.save(db, payload, result)
    
    return result


@router.get("/history", response_model=HistoryResponse)
def get_history(db: Session = Depends(get_db), limit: int = 20) -> HistoryResponse:
    """
    Retrieve prediction history.
    """
    return HistoryResponse(items=history_service.fetch_recent(db, limit=limit))
