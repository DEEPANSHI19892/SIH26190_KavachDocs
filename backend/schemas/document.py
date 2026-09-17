from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DocumentResponse(BaseModel):
    id: int
    case_id: int
    case_number: Optional[str] = None
    title: str
    document_type: str
    description: Optional[str]
    file_path: Optional[str] = None
    file_size: int
    sha256_hash: str
    current_version: int
    uploaded_by: int
    created_at: datetime

    class Config:
        from_attributes = True

class VersionResponse(BaseModel):
    id: int
    document_id: int
    version_number: int
    sha256_hash: str
    uploaded_by: int
    reason: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True