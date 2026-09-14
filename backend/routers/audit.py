from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from models.audit import AuditLog
from schemas.audit import AuditLogResponse
from security.rbac import get_current_user

router = APIRouter(tags=["Audit"])

@router.get("/audit-logs")
def get_audit_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["ADMIN", "INVESTIGATION_OFFICER"]:
        raise HTTPException(status_code=403, detail="Access denied")

    logs = db.query(AuditLog).order_by(AuditLog.id.desc()).limit(100).all()
    return [AuditLogResponse.from_orm(log) for log in logs]