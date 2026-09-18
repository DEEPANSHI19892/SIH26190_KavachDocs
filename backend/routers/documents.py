from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import Response
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from models.document import Document, DocumentVersion
from models.case import Case
from schemas.document import DocumentResponse, VersionResponse
from security.rbac import get_current_user
from services.document_service import (
    create_document,
    verify_document_integrity,
    upload_new_version,
    get_document_bytes,
)
from services.audit_service import log_action
from services.security_service import log_blocked_action

router = APIRouter(prefix="/documents", tags=["Documents"])


def enrich_document(db: Session, doc: Document) -> dict:
    case = db.query(Case).filter(Case.id == doc.case_id).first()
    data = DocumentResponse.from_orm(doc).model_dump()
    data["case_number"] = case.case_number if case else None
    return data


@router.post("/upload")
async def upload_document(
    case_id: int = Form(...),
    title: str = Form(...),
    document_type: str = Form(None),
    description: str = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role not in ["ADMIN", "INVESTIGATION_OFFICER", "LEGAL_OFFICER"]:
        log_blocked_action(db, current_user.id, "DOCUMENT_UPLOAD", case_id=case_id)
        raise HTTPException(status_code=403, detail="Access denied")

    document = await create_document(
        db=db,
        case_id=case_id,
        title=title,
        file=file,
        uploaded_by=current_user.id,
        description=description,
        document_type=document_type,
    )

    return enrich_document(db, document)


@router.get("")
def list_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    documents = db.query(Document).order_by(Document.id.desc()).all()
    return [enrich_document(db, d) for d in documents]


@router.get("/{document_id}")
def get_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    log_action(
        db=db,
        user_id=current_user.id,
        action="DOCUMENT_VIEWED",
        result="SUCCESS",
        document_id=document_id,
    )

    return enrich_document(db, document)


@router.get("/{document_id}/download")
def download_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    data, filename, mime = get_document_bytes(db, document_id)

    log_action(
        db=db,
        user_id=current_user.id,
        action="DOCUMENT_DOWNLOADED",
        result="SUCCESS",
        document_id=document_id,
    )

    return Response(
        content=data,
        media_type=mime,
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        },
    )


@router.post("/{document_id}/verify")
def verify_integrity(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = verify_document_integrity(db, document_id, current_user.id)
    return result


@router.post("/{document_id}/version")
async def upload_version(
    document_id: int,
    file: UploadFile = File(...),
    reason: str = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role not in ["ADMIN", "INVESTIGATION_OFFICER"]:
        log_blocked_action(db, current_user.id, "VERSION_UPLOAD", document_id=document_id)
        raise HTTPException(status_code=403, detail="Access denied")

    document = await upload_new_version(
        db=db,
        document_id=document_id,
        file=file,
        uploaded_by=current_user.id,
        reason=reason,
    )

    return enrich_document(db, document)


@router.get("/{document_id}/versions")
def get_versions(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    versions = (
        db.query(DocumentVersion)
        .filter(DocumentVersion.document_id == document_id)
        .all()
    )
    return [VersionResponse.from_orm(v) for v in versions]