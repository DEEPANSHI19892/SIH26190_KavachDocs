from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from models.case import Case
from schemas.case import CaseCreate, CaseResponse
from security.rbac import get_current_user, require_roles
from services.audit_service import log_action

router = APIRouter(prefix="/cases", tags=["Cases"])

@router.post("")
def create_case(
    case_data: CaseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["ADMIN", "INVESTIGATION_OFFICER"]:
        raise HTTPException(status_code=403, detail="Access denied")

    # Check if case number exists
    existing = db.query(Case).filter(Case.case_number == case_data.case_number).first()
    if existing:
        raise HTTPException(status_code=400, detail="Case number already exists")

    case = Case(
        case_number=case_data.case_number,
        title=case_data.title,
        description=case_data.description,
        case_type=case_data.case_type,
        priority=case_data.priority,
        created_by=current_user.id,
        assigned_officer=case_data.assigned_officer
    )
    db.add(case)
    db.commit()
    db.refresh(case)

    log_action(
        db=db,
        user_id=current_user.id,
        action="CASE_CREATED",
        result="SUCCESS",
        case_id=case.id,
        details=f"Case: {case.case_number} - {case.title}"  # Changed
    )

    return CaseResponse.from_orm(case)

@router.get("")
def list_cases(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cases = db.query(Case).all()
    return [CaseResponse.from_orm(c) for c in cases]

@router.get("/{case_id}")
def get_case(
    case_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return CaseResponse.from_orm(case)