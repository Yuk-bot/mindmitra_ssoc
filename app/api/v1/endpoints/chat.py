from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.services.chatbot import get_ai_response
from app.api.v1.endpoints.auth import get_current_user
from app.models.user import User

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

router = APIRouter()

@router.post('/chat', response_model=ChatResponse)
def chat_endpoint(request: ChatRequest, current_user: User = Depends(get_current_user)):
    ai_response = get_ai_response(request.message)
    return ChatResponse(response=ai_response) 