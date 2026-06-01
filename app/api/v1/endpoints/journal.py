from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.journal import JournalEntry, JournalEntryCreate
from app.api.v1.endpoints.auth import get_current_user

def get_db():
    """Stub for SQLAlchemy compatibility in pre-existing journal endpoint"""
    yield None
from app.models.user import User
from typing import List

router = APIRouter()

@router.get('/journal', response_model=List[JournalEntry])
def get_journal_entries(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(JournalEntry).filter(JournalEntry.user_id == current_user.id).order_by(JournalEntry.date.desc()).all()

@router.post('/journal', response_model=JournalEntry)
def create_journal_entry(entry: JournalEntryCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_entry = JournalEntry(**entry.dict(), user_id=current_user.id)
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry 