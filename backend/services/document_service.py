import os
import shutil
from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session
from models.document import Document, DocumentVersion
from models.case import Case
from security.hashing import generate_sha256, verify_integrity
from services.audit_service import log_action
from ai.classifier import classify_document_type
from config import settings

def save_uploaded_file(file: UploadFile, case_number: str, version: int = 1) -> str:
    """Save file to storage and return file path"""
    case_folder = os.path.join(settings.STORAGE_PATH, case_number)
    os.makedirs(case_folder, exist_ok=True)

    filename = f"v{version}_{file.filename}"
    file_path = os.path.join(case_folder, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return file_path

def create_document(
    db: Session,
    case_id: int,
    title: str,
    file: UploadFile,
    uploaded_by: int,
    description: str = None,
    document_type: str = None
) -> Document:
    # Get case
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    # Auto-classify document type if not provided
    if not document_type:
        document_type = classify_document_type(file.filename, title)

    # Save file
    file_path = save_uploaded_file(file, case.case_number, version=1)

    # Generate hash
    sha256_hash = generate_sha256(file_path)

    # Get file size
    file_size = os.path.getsize(file_path)

    # Create document record
    document = Document(
        case_id=case_id,
        title=title,
        document_type=document_type,
        description=description,
        file_path=file_path,
        file_size=file_size,
        sha256_hash=sha256_hash,
        current_version=1,
        uploaded_by=uploaded_by
    )
    db.add(document)
    db.commit()
    db.refresh(document)

    # Create first version
    version = DocumentVersion(
        document_id=document.id,
        version_number=1,
        file_path=file_path,
        sha256_hash=sha256_hash,
        uploaded_by=uploaded_by,
        reason="Initial upload"
    )
    db.add(version)
    db.commit()

    # Log audit
    log_action(
        db=db,
        user_id=uploaded_by,
        action="DOCUMENT_UPLOADED",
        result="SUCCESS",
        case_id=case_id,
        document_id=document.id,
        details=f"Document: {title}, Type: {document_type}, SHA-256: {sha256_hash[:16]}..."  # Changed
    )

    return document

def verify_document_integrity(db: Session, document_id: int, user_id: int) -> dict:
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    is_valid = verify_integrity(document.file_path, document.sha256_hash)

    # Log verification
    log_action(
        db=db,
        user_id=user_id,
        action="INTEGRITY_VERIFIED",
        result="SUCCESS" if is_valid else "FAILED",
        document_id=document_id,
        details=f"Integrity check {'passed' if is_valid else 'FAILED - TAMPERING DETECTED'}"  # Changed
    )

    return {
        "document_id": document_id,
        "integrity": "VERIFIED" if is_valid else "COMPROMISED",
        "stored_hash": document.sha256_hash
    }

def upload_new_version(
    db: Session,
    document_id: int,
    file: UploadFile,
    uploaded_by: int,
    reason: str = None
) -> Document:
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    case = db.query(Case).filter(Case.id == document.case_id).first()
    new_version = document.current_version + 1

    # Save new file
    file_path = save_uploaded_file(file, case.case_number, version=new_version)

    # Generate hash
    sha256_hash = generate_sha256(file_path)

    # Create version record
    version = DocumentVersion(
        document_id=document_id,
        version_number=new_version,
        file_path=file_path,
        sha256_hash=sha256_hash,
        uploaded_by=uploaded_by,
        reason=reason or "New version uploaded"
    )
    db.add(version)

    # Update document
    document.current_version = new_version
    document.file_path = file_path
    document.sha256_hash = sha256_hash

    db.commit()
    db.refresh(document)

    # Log audit
    log_action(
        db=db,
        user_id=uploaded_by,
        action="VERSION_CREATED",
        result="SUCCESS",
        document_id=document_id,
        details=f"Version {new_version} created, SHA-256: {sha256_hash[:16]}..."  # Changed
    )

    return document