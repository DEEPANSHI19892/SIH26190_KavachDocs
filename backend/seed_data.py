from database import SessionLocal, engine, Base
from models.user import User
from models.case import Case
from security.hashing import hash_password

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if users exist
    if db.query(User).count() == 0:
        # Create users with simpler passwords
        users = [
            User(email="admin@kavachdocs.in", full_name="System Admin", password_hash=hash_password("Admin@123"), role="ADMIN"),
            User(email="officer@kavachdocs.in", full_name="Officer A", password_hash=hash_password("Officer@123"), role="INVESTIGATION_OFFICER"),
            User(email="legal@kavachdocs.in", full_name="Legal Officer B", password_hash=hash_password("Legal@123"), role="LEGAL_OFFICER"),
            User(email="viewer@kavachdocs.in", full_name="Viewer C", password_hash=hash_password("Viewer@123"), role="VIEWER"),
        ]
        db.add_all(users)
        db.commit()
        print("✅ Users created")
    else:
        print("ℹ️ Users already exist, skipping...")

    # Create sample case
    if db.query(Case).count() == 0:
        case = Case(
            case_number="CASE-1024",
            title="Cyber Fraud Investigation",
            description="Investigation of online financial fraud involving unauthorized transactions",
            case_type="Cyber Crime",
            status="ACTIVE",
            priority="HIGH",
            created_by=1,
            assigned_officer=2
        )
        db.add(case)
        db.commit()
        print("✅ Sample case created")
    else:
        print("ℹ️ Cases already exist, skipping...")

    db.close()
    print("✅ Seed data complete")

if __name__ == "__main__":
    seed()