import json

from sqlalchemy import desc
from sqlalchemy.orm import Session

from models.history import PredictionHistory
from models.schemas import HistoryItem, PredictRequest, PredictResponse


class HistoryService:
    def save(self, db: Session, profile: PredictRequest, result: PredictResponse) -> None:
        row = PredictionHistory(profile_json=profile.model_dump_json(), result_json=result.model_dump_json())
        db.add(row)
        db.commit()

    def fetch_recent(self, db: Session, limit: int = 20) -> list[HistoryItem]:
        rows = db.query(PredictionHistory).order_by(desc(PredictionHistory.created_at)).limit(limit).all()
        return [
            HistoryItem(
                id=item.id,
                profile=PredictRequest.model_validate(json.loads(item.profile_json)),
                result=PredictResponse.model_validate(json.loads(item.result_json)),
                created_at=item.created_at,
            )
            for item in rows
        ]
