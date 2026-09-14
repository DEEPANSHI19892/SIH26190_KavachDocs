from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from models.security import SecurityEvent
from schemas.audit import SecurityEventResponse
from security.rbac import get_current_user

router = APIRouter(tags=["Security"])

@router.get("/security-events")
def get_security_events(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["ADMIN", "INVESTIGATION_OFFICER"]:
        raise HTTPException(status_code=403, detail="Access denied")

    events = db.query(SecurityEvent).order_by(SecurityEvent.id.desc()).limit(50).all()
    return [SecurityEventResponse.from_orm(e) for e in events]

@router.post("/security-events/{event_id}/resolve")
def resolve_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Only admin can resolve events")

    event = db.query(SecurityEvent).filter(SecurityEvent.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    event.resolved = True
    db.commit()

    return {"message": "Event resolved"}