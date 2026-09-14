from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class Case(Base):
    __tablename__ = "cases"

    id = Column(Integer, primary_key=True, index=True)
    case_number = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    case_type = Column(String, nullable=False)
    status = Column(String, default="ACTIVE")  # ACTIVE, CLOSED, PENDING
    priority = Column(String, default="MEDIUM")  # HIGH, MEDIUM, LOW
    created_by = Column(Integer, ForeignKey("users.id"))
    assigned_officer = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    documents = relationship("Document", back_populates="case", cascade="all, delete")
