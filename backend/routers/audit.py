from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from models.audit import AuditLog
from schemas.audit import AuditLogResponse
from security.rbac import get_current_user

router = APIRouter(tags=["Audit"])

@router.get("/audit-logs", response_model=list[AuditLogResponse])
def get_audit_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["ADMIN", "INVESTIGATION_OFFICER", "LEGAL_OFFICER", "VIEWER"]:
        raise HTTPException(status_code=403, detail="Access denied")

    logs = db.query(AuditLog).order_by(AuditLog.id.desc()).limit(100).all()

    # Enrich with user info
    result = []
    for log in logs:
        user = db.query(User).filter(User.id == log.user_id).first() if log.user_id else None
        result.append(AuditLogResponse(
            id=log.id,
            user_id=log.user_id,
            user_name=user.full_name if user else None,
            user_email=user.email if user else None,
            case_id=log.case_id,
            document_id=log.document_id,
            action=log.action,
            result=log.result,
            ip_address=log.ip_address,
            details=log.details,
            previous_hash=log.previous_hash,
            current_hash=log.current_hash,
            created_at=log.created_at,
        ))
    return result