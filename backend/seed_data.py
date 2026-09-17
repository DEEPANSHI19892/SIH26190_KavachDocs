from database import SessionLocal, engine, Base
from models.user import User
from models.case import Case
from security.hashing import hash_password


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # ---------------- USERS ----------------
        if db.query(User).count() == 0:
            users = [
                User(
                    email="admin@kavachdocs.in",
                    full_name="System Admin",
                    password_hash=hash_password("Admin@123"),
                    role="ADMIN",
                ),
                User(
                    email="officer@kavachdocs.in",
                    full_name="Officer A",
                    password_hash=hash_password("Officer@123"),
                    role="INVESTIGATION_OFFICER",
                ),
                User(
                    email="legal@kavachdocs.in",
                    full_name="Legal Officer B",
                    password_hash=hash_password("Legal@123"),
                    role="LEGAL_OFFICER",
                ),
                User(
                    email="viewer@kavachdocs.in",
                    full_name="Viewer C",
                    password_hash=hash_password("Viewer@123"),
                    role="VIEWER",
                ),
            ]
            db.add_all(users)
            db.commit()
            print("[OK] Users created")
        else:
            print("[SKIP] Users already exist")

        # ---------------- CASES ----------------
        if db.query(Case).count() == 0:
            cases = [
                Case(
                    case_number="CASE-1024",
                    title="Cyber Fraud Investigation",
                    description="Investigation of online financial fraud involving unauthorized transactions.",
                    case_type="Cyber Crime",
                    status="ACTIVE",
                    priority="HIGH",
                    created_by=1,
                    assigned_officer=2,
                ),
                Case(
                    case_number="CASE-2026-002",
                    title="Financial Fraud Investigation",
                    description="Suspicious bank transactions totaling Rs. 50 lakhs flagged by forensic audit.",
                    case_type="Financial Crime",
                    status="ACTIVE",
                    priority="HIGH",
                    created_by=1,
                    assigned_officer=2,
                ),
                Case(
                    case_number="CASE-2026-003",
                    title="Drug Trafficking Network",
                    description="Interstate drug trafficking ring busted. Multiple suspects in custody.",
                    case_type="Narcotics",
                    status="ACTIVE",
                    priority="CRITICAL",
                    created_by=1,
                    assigned_officer=2,
                ),
                Case(
                    case_number="CASE-2026-004",
                    title="Missing Person Investigation",
                    description="Complaint filed for missing person last seen near railway station.",
                    case_type="Missing Person",
                    status="ACTIVE",
                    priority="MEDIUM",
                    created_by=1,
                    assigned_officer=2,
                ),
            ]
            db.add_all(cases)
            db.commit()
            print("[OK] Sample cases created")
        else:
            print("[SKIP] Cases already exist")

    finally:
        db.close()

    print("[DONE] Seed complete")


if __name__ == "__main__":
    seed()