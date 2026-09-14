from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CaseCreate(BaseModel):
    case_number: str
    title: str
    description: Optional[str] = None
    case_type: str
    priority: Optional[str] = "MEDIUM"
    assigned_officer: Optional[int] = None

class CaseResponse(BaseModel):
    id: int
    case_number: str
    title: str
    description: Optional[str]
    case_type: str
    status: str
    priority: str
    created_by: int
    assigned_officer: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True
