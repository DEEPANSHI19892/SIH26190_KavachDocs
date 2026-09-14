from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from routers import auth, cases, documents, audit, security

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="KavachDocs API",
    description="Secure Digital Document Management System for Legal and Investigation Documents",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(cases.router)
app.include_router(documents.router)
app.include_router(audit.router)
app.include_router(security.router)

@app.get("/")
def root():
    return {"message": "KavachDocs Backend Running!", "docs": "/docs"}