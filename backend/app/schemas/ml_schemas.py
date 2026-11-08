from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class PredictPerformanceRequest(BaseModel):
    player_id: Optional[str] = None
    player_name: Optional[str] = "Athletic Contender"
    sport_name: str = Field(default="Football", description="Sport category")
    matches_played: int = Field(default=20, ge=1, le=1000)
    matches_won: int = Field(default=12, ge=0)
    goals_or_points: float = Field(default=15.0, ge=0.0)
    assists_or_passes: float = Field(default=8.0, ge=0.0)
    recent_form: float = Field(default=75.0, ge=0.0, le=100.0)
    consistency_score: float = Field(default=78.0, ge=0.0, le=100.0)
    minutes_played: Optional[int] = 1200

class TalentAnalysisRequest(BaseModel):
    sport_name: Optional[str] = None
    players: Optional[List[Dict[str, Any]]] = None

class UserInterestItem(BaseModel):
    sport_name: str
    interest_level: int = Field(default=8, ge=1, le=10)
    preferred_tags: List[str] = []

class UpdateInterestsRequest(BaseModel):
    interests: List[UserInterestItem]
