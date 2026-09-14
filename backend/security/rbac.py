from functools import wraps
from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from security.jwt_handler import verify_token
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    token = credentials.credentials
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    user_id = int(payload.get("sub"))
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    if not user.is_active:
        raise HTTPException(status_code=401, detail="User account disabled")
    
    return user

def require_roles(*allowed_roles):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            current_user = kwargs.get("current_user")
            if not current_user:
                raise HTTPException(status_code=401, detail="Authentication required")
            if current_user.role not in allowed_roles:
                raise HTTPException(status_code=403, detail=f"Access denied. Required roles: {allowed_roles}")
            return await func(*args, **kwargs)
        return wrapper
    return decorator
