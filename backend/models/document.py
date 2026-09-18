from sqlalchemy import (
    Column, Integer, String, DateTime, ForeignKey,
    Boolean, Text, LargeBinary
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"), nullable=False)
    title = Column(String, nullable=False)
    document_type = Column(String, nullable=False)
    description = Column(Text, nullable=True)

    # File storage
    file_path = Column(String, nullable=True)     # kept for legacy / local
    file_data = Column(LargeBinary, nullable=True) # NEW: bytes in DB
    file_mime = Column(String, nullable=True)      # NEW: content-type
    file_name = Column(String, nullable=True)      # NEW: original filename
    file_size = Column(Integer, default=0)

    sha256_hash = Column(String, nullable=False)
    current_version = Column(Integer, default=1)
    uploaded_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    case = relationship("Case", back_populates="documents")
    versions = relationship(
        "DocumentVersion",
        back_populates="document",
        cascade="all, delete"
    )


class DocumentVersion(Base):
    __tablename__ = "document_versions"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)
    version_number = Column(Integer, nullable=False)

    file_path = Column(String, nullable=True)
    file_data = Column(LargeBinary, nullable=True)  # NEW
    file_mime = Column(String, nullable=True)       # NEW
    file_name = Column(String, nullable=True)       # NEW

    sha256_hash = Column(String, nullable=False)
    uploaded_by = Column(Integer, ForeignKey("users.id"))
    reason = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    document = relationship("Document", back_populates="versions")