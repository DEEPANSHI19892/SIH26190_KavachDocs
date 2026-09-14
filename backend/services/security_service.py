from sqlalchemy.orm import Session
from services.audit_service import log_action, create_security_event

def log_blocked_action(
    db: Session,
    user_id: int,
    action: str,
    document_id: int = None,
    case_id: int = None
):
    # Log the blocked action
    audit_log = log_action(
        db=db,
        user_id=user_id,
        action=action,
        result="BLOCKED",
        document_id=document_id,
        case_id=case_id,
        details="Unauthorized access attempt blocked"  # Changed
    )

    # Create security event
    create_security_event(
        db=db,
        audit_log_id=audit_log.id,
        description=f"Unauthorized {action} attempt blocked",
        user_id=user_id,
        document_id=document_id,
        severity="HIGH"
    )