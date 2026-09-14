from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    case_id = Column(Integer, ForeignKey("cases.id"), nullable=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=True)
    action = Column(String, nullable=False)
    result = Column(String, nullable=False)  # SUCCESS, FAILED, BLOCKED
    ip_address = Column(String, nullable=True)
    details = Column(Text, nullable=True)  # Changed from 'metadata' to 'details'
    previous_hash = Column(String, nullable=True)
    current_hash = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())