from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class AuditLogResponse(BaseModel):
    id: int
    user_id: Optional[int]
    user_name: Optional[str] = None
    user_email: Optional[str] = None
    case_id: Optional[int]
    document_id: Optional[int]
    action: str
    result: str
    ip_address: Optional[str]
    details: Optional[str]
    previous_hash: Optional[str]
    current_hash: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class SecurityEventResponse(BaseModel):
    id: int
    audit_log_id: Optional[int]
    severity: str
    description: str
    user_id: Optional[int]
    document_id: Optional[int]
    resolved: bool
    created_at: datetime

    class Config:
        from_attributes = True