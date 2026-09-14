import hashlib
import bcrypt
from passlib.context import CryptContext

# Use a simpler password hashing approach
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=12)

def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    # Truncate password to 72 bytes if needed
    password_bytes = password.encode('utf-8')[:72]
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(password_bytes, salt).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    try:
        # Truncate password to 72 bytes if needed
        password_bytes = plain_password.encode('utf-8')[:72]
        return bcrypt.checkpw(password_bytes, hashed_password.encode('utf-8'))
    except Exception:
        return False

def generate_sha256(file_path: str) -> str:
    """Generate SHA-256 hash of a file"""
    sha256_hash = hashlib.sha256()
    with open(file_path, "rb") as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()

def verify_integrity(file_path: str, expected_hash: str) -> bool:
    """Verify file integrity by comparing SHA-256 hash"""
    current_hash = generate_sha256(file_path)
    return current_hash == expected_hash