import os
from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session
from models.document import Document, DocumentVersion
from models.case import Case
from security.hashing import (
    generate_sha256_from_bytes,
    verify_integrity_bytes,
)
from services.audit_service import log_action
from ai.classifier import classify_document_type


async def _read_upload(file: UploadFile) -> tuple[bytes, str, str, int]:
    """Read uploaded file into memory. Returns (bytes, filename, mime, size)"""
    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail="Empty file")
    return data, file.filename or "document", file.content_type or "application/octet-stream", len(data)


async def create_document(
    db: Session,
    case_id: int,
    title: str,
    file: UploadFile,
    uploaded_by: int,
    description: str = None,
    document_type: str = None,
) -> Document:
    # Get case
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    # Auto-classify if not provided
    if not document_type:
        document_type = classify_document_type(file.filename or "", title)

    # Read file into bytes
    file_bytes, filename, mime, size = await _read_upload(file)

    # Hash from bytes
    sha256_hash = generate_sha256_from_bytes(file_bytes)

    # Create document record
    document = Document(
        case_id=case_id,
        title=title,
        document_type=document_type,
        description=description,
        file_path=None,                # not storing on disk anymore
        file_data=file_bytes,          # bytes go to Neon
        file_mime=mime,
        file_name=filename,
        file_size=size,
        sha256_hash=sha256_hash,
        current_version=1,
        uploaded_by=uploaded_by,
    )
    db.add(document)
    db.commit()
    db.refresh(document)

    # Create first version
    version = DocumentVersion(
        document_id=document.id,
        version_number=1,
        file_data=file_bytes,
        file_mime=mime,
        file_name=filename,
        sha256_hash=sha256_hash,
        uploaded_by=uploaded_by,
        reason="Initial upload",
    )
    db.add(version)
    db.commit()

    # Audit log
    log_action(
        db=db,
        user_id=uploaded_by,
        action="DOCUMENT_UPLOADED",
        result="SUCCESS",
        case_id=case_id,
        document_id=document.id,
        details=f"Document: {title}, Type: {document_type}, SHA-256: {sha256_hash[:16]}...",
    )

    return document


def verify_document_integrity(db: Session, document_id: int, user_id: int) -> dict:
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    if not document.file_data:
        raise HTTPException(status_code=404, detail="File data not found in database")

    is_valid = verify_integrity_bytes(document.file_data, document.sha256_hash)

    log_action(
        db=db,
        user_id=user_id,
        action="INTEGRITY_VERIFIED",
        result="SUCCESS" if is_valid else "FAILED",
        document_id=document_id,
        details=f"Integrity check {'passed' if is_valid else 'FAILED - TAMPERING DETECTED'}",
    )

    return {
        "document_id": document_id,
        "integrity": "VERIFIED" if is_valid else "COMPROMISED",
        "stored_hash": document.sha256_hash,
    }


async def upload_new_version(
    db: Session,
    document_id: int,
    file: UploadFile,
    uploaded_by: int,
    reason: str = None,
) -> Document:
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    new_version = document.current_version + 1

    # Read new file
    file_bytes, filename, mime, size = await _read_upload(file)
    sha256_hash = generate_sha256_from_bytes(file_bytes)

    # Version record
    version = DocumentVersion(
        document_id=document_id,
        version_number=new_version,
        file_data=file_bytes,
        file_mime=mime,
        file_name=filename,
        sha256_hash=sha256_hash,
        uploaded_by=uploaded_by,
        reason=reason or "New version uploaded",
    )
    db.add(version)

    # Update current document
    document.current_version = new_version
    document.file_data = file_bytes
    document.file_mime = mime
    document.file_name = filename
    document.file_size = size
    document.sha256_hash = sha256_hash

    db.commit()
    db.refresh(document)

    log_action(
        db=db,
        user_id=uploaded_by,
        action="VERSION_CREATED",
        result="SUCCESS",
        document_id=document_id,
        details=f"Version {new_version} created, SHA-256: {sha256_hash[:16]}...",
    )

    return document


def get_document_bytes(db: Session, document_id: int) -> tuple[bytes, str, str]:
    """Return (bytes, filename, mime) for download"""
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    if not document.file_data:
        raise HTTPException(status_code=404, detail="File data missing in DB")
    return (
        document.file_data,
        document.file_name or f"document_{document.id}",
        document.file_mime or "application/octet-stream",
    )