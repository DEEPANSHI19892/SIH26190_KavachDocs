from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine, SessionLocal
from routers import auth, cases, documents, audit, security

# Import models so they register
from models import user, case, document, audit as audit_model, security as security_model


def auto_seed_if_empty():
    """Seed DB with demo data only if empty (safe on every startup)"""
    from models.user import User
    from models.case import Case
    from security.hashing import hash_password

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(User).count() == 0:
            users = [
                User(email="admin@kavachdocs.in", full_name="System Admin",
                     password_hash=hash_password("Admin@123"), role="ADMIN"),
                User(email="officer@kavachdocs.in", full_name="Officer A",
                     password_hash=hash_password("Officer@123"), role="INVESTIGATION_OFFICER"),
                User(email="legal@kavachdocs.in", full_name="Legal Officer B",
                     password_hash=hash_password("Legal@123"), role="LEGAL_OFFICER"),
                User(email="viewer@kavachdocs.in", full_name="Viewer C",
                     password_hash=hash_password("Viewer@123"), role="VIEWER"),
            ]
            db.add_all(users)
            db.commit()
            print("[SEED] Users created")

        if db.query(Case).count() == 0:
            cases = [
                Case(case_number="CASE-1024", title="Cyber Fraud Investigation",
                     description="Investigation of online financial fraud involving unauthorized transactions.",
                     case_type="Cyber Crime", status="ACTIVE", priority="HIGH",
                     created_by=1, assigned_officer=2),
                Case(case_number="CASE-2026-002", title="Financial Fraud Investigation",
                     description="Suspicious bank transactions totaling Rs. 50 lakhs flagged by forensic audit.",
                     case_type="Financial Crime", status="ACTIVE", priority="HIGH",
                     created_by=1, assigned_officer=2),
                Case(case_number="CASE-2026-003", title="Drug Trafficking Network",
                     description="Interstate drug trafficking ring busted. Multiple suspects in custody.",
                     case_type="Narcotics", status="ACTIVE", priority="CRITICAL",
                     created_by=1, assigned_officer=2),
                Case(case_number="CASE-2026-004", title="Missing Person Investigation",
                     description="Complaint filed for missing person last seen near railway station.",
                     case_type="Missing Person", status="ACTIVE", priority="MEDIUM",
                     created_by=1, assigned_officer=2),
            ]
            db.add_all(cases)
            db.commit()
            print("[SEED] Cases created")
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    Base.metadata.create_all(bind=engine)
    auto_seed_if_empty()
    print("[STARTUP] KavachDocs backend ready")
    yield
    # Shutdown
    print("[SHUTDOWN] KavachDocs backend stopped")


app = FastAPI(
    title="KavachDocs API",
    description="Secure Digital Document Management System for Legal and Investigation Documents",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "https://kavachdocs.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router)
app.include_router(cases.router)
app.include_router(documents.router)
app.include_router(audit.router)
app.include_router(security.router)


@app.get("/")
def root():
    return {"message": "KavachDocs Backend Running!", "docs": "/docs"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
