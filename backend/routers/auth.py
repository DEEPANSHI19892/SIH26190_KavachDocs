from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from schemas.user import UserCreate, UserLogin, UserResponse
from security.hashing import hash_password, verify_password
from security.jwt_handler import create_access_token
from security.rbac import get_current_user, require_roles
from services.audit_service import log_action

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register")
def register(user_data: UserCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Only admin can register users
    if current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Only admin can register users")

    # Check if user exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create user
    user = User(
        email=user_data.email,
        full_name=user_data.full_name,
        password_hash=hash_password(user_data.password),
        role=user_data.role
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    log_action(
        db=db,
        user_id=current_user.id,
        action="USER_REGISTERED",
        result="SUCCESS",
        details=f"New user: {user.email}, Role: {user.role}"  # Changed from metadata to details
    )

    return {"message": "User created successfully", "user": UserResponse.from_orm(user)}

@router.post("/login")
def login(user_data: UserLogin, request: Request, db: Session = Depends(get_db)):
    # Find user
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user:
        log_action(db=db, user_id=None, action="LOGIN", result="FAILED", details="Email not found")  # Changed
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Verify password
    if not verify_password(user_data.password, user.password_hash):
        log_action(db=db, user_id=user.id, action="LOGIN", result="FAILED", details="Wrong password")  # Changed
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not user.is_active:
        log_action(db=db, user_id=user.id, action="LOGIN", result="BLOCKED", details="Account disabled")  # Changed
        raise HTTPException(status_code=401, detail="Account disabled")

    # Generate token
    token = create_access_token(user.id, user.role)

    # Log audit
    log_action(
        db=db,
        user_id=user.id,
        action="LOGIN",
        result="SUCCESS",
        ip_address=request.client.host if request.client else None
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": UserResponse.from_orm(user)
    }

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse.from_orm(current_user)