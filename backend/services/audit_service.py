import hashlib
from sqlalchemy.orm import Session
from models.audit import AuditLog
from models.security import SecurityEvent

def log_action(
    db: Session,
    user_id: int,
    action: str,
    result: str,
    case_id: int = None,
    document_id: int = None,
    details: str = None,  # Changed from metadata to details
    ip_address: str = None
) -> AuditLog:
    # Get last audit log for hash chaining
    last_log = db.query(AuditLog).order_by(AuditLog.id.desc()).first()
    previous_hash = last_log.current_hash if last_log else None

    # Create new log
    new_log = AuditLog(
        user_id=user_id,
        action=action,
        result=result,
        case_id=case_id,
        document_id=document_id,
        details=details,  # Changed from metadata to details
        ip_address=ip_address,
        previous_hash=previous_hash
    )
    db.add(new_log)
    db.commit()
    db.refresh(new_log)

    # Generate current hash
    hash_input = f"{new_log.id}{new_log.action}{new_log.result}{new_log.created_at}{previous_hash or ''}"
    new_log.current_hash = hashlib.sha256(hash_input.encode()).hexdigest()
    db.commit()
    db.refresh(new_log)

    return new_log

def create_security_event(
    db: Session,
    audit_log_id: int,
    description: str,
    user_id: int = None,
    document_id: int = None,
    severity: str = "HIGH"
) -> SecurityEvent:
    event = SecurityEvent(
        audit_log_id=audit_log_id,
        severity=severity,
        description=description,
        user_id=user_id,
        document_id=document_id
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return event