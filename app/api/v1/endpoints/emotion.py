from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.api.v1.endpoints.auth import get_current_user
from app.models.user import User
from typing import Optional

class EmotionRequest(BaseModel):
    text: Optional[str] = None
    image_base64: Optional[str] = None

class EmotionResponse(BaseModel):
    emotion: str
    confidence: float

router = APIRouter()

@router.post('/emotion', response_model=EmotionResponse)
def detect_emotion(request: EmotionRequest, current_user: User = Depends(get_current_user)):
    # If image is provided, stub: always return 'happy' for demo
    if request.image_base64:
        return EmotionResponse(emotion='happy', confidence=0.92)
    # Dummy logic for text
    if request.text and 'sad' in request.text.lower():
        return EmotionResponse(emotion='sad', confidence=0.95)
    return EmotionResponse(emotion='calm', confidence=0.80) 