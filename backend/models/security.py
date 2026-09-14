from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.sql import func
from database import Base

class SecurityEvent(Base):
    __tablename__ = "security_events"

    id = Column(Integer, primary_key=True, index=True)
    audit_log_id = Column(Integer, ForeignKey("audit_logs.id"), nullable=True)
    severity = Column(String, default="HIGH")  # LOW, MEDIUM, HIGH, CRITICAL
    description = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=True)
    resolved = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
