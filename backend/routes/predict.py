from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models.schemas import HistoryResponse, PredictRequest, PredictResponse
from services.history_service import HistoryService
from services.predictor import MLReadyPredictorFacade
from services.recommender import RecommendationService

router = APIRouter(prefix="/predict", tags=["predict"])
predictor = MLReadyPredictorFacade()
recommender = RecommendationService()
history_service = HistoryService()


@router.post("", response_model=PredictResponse)
def predict(payload: PredictRequest, db: Session = Depends(get_db)) -> PredictResponse:
    mode, roles = predictor.predict(payload)
    result = PredictResponse(
        mode=mode,
        roles=roles,
        skill_suggestions=recommender.build_skill_suggestions(payload),
        recommendations=recommender.build_profile_recommendations(payload),
    )
    history_service.save(db, payload, result)
    return result


@router.get("/history", response_model=HistoryResponse)
def get_history(db: Session = Depends(get_db), limit: int = 20) -> HistoryResponse:
    return HistoryResponse(items=history_service.fetch_recent(db, limit=limit))
