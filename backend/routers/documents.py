import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from models.document import Document, DocumentVersion
from schemas.document import DocumentResponse, VersionResponse
from security.rbac import get_current_user
from services.document_service import create_document, verify_document_integrity, upload_new_version
from services.audit_service import log_action
from services.security_service import log_blocked_action

router = APIRouter(prefix="/documents", tags=["Documents"])

@router.post("/upload")
async def upload_document(
    case_id: int = Form(...),
    title: str = Form(...),
    document_type: str = Form(None),
    description: str = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # RBAC check
    if current_user.role not in ["ADMIN", "INVESTIGATION_OFFICER", "LEGAL_OFFICER"]:
        log_blocked_action(db, current_user.id, "DOCUMENT_UPLOAD", case_id=case_id)
        raise HTTPException(status_code=403, detail="Access denied")

    document = create_document(
        db=db,
        case_id=case_id,
        title=title,
        file=file,
        uploaded_by=current_user.id,
        description=description,
        document_type=document_type
    )

    return DocumentResponse.from_orm(document)

@router.get("/{document_id}")
def get_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    # Log view
    log_action(
        db=db,
        user_id=current_user.id,
        action="DOCUMENT_VIEWED",
        result="SUCCESS",
        document_id=document_id
    )

    return DocumentResponse.from_orm(document)

@router.get("/{document_id}/download")
def download_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    if not os.path.exists(document.file_path):
        raise HTTPException(status_code=404, detail="File not found on server")

    # Log download
    log_action(
        db=db,
        user_id=current_user.id,
        action="DOCUMENT_DOWNLOADED",
        result="SUCCESS",
        document_id=document_id
    )

    return FileResponse(
        path=document.file_path,
        filename=f"{document.title}",
        media_type="application/octet-stream"
    )

@router.post("/{document_id}/verify")
def verify_integrity(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = verify_document_integrity(db, document_id, current_user.id)
    return result

@router.post("/{document_id}/version")
async def upload_version(
    document_id: int,
    file: UploadFile = File(...),
    reason: str = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # RBAC check
    if current_user.role not in ["ADMIN", "INVESTIGATION_OFFICER"]:
        log_blocked_action(db, current_user.id, "VERSION_UPLOAD", document_id=document_id)
        raise HTTPException(status_code=403, detail="Access denied")

    document = upload_new_version(
        db=db,
        document_id=document_id,
        file=file,
        uploaded_by=current_user.id,
        reason=reason
    )

    return DocumentResponse.from_orm(document)

@router.get("/{document_id}/versions")
def get_versions(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    versions = db.query(DocumentVersion).filter(DocumentVersion.document_id == document_id).all()
    return [VersionResponse.from_orm(v) for v in versions]