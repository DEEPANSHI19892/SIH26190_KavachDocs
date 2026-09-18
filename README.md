# KavachDocs

### Secure Digital Document & Case Management System

> Secure Documents. Trusted Evidence.

KavachDocs is a secure digital platform for managing legal and investigation documents, cases, and evidence. It focuses on secure access, cryptographic document integrity, tamper-evident audit trails, role-based access control, and evidence chain of custody.

---

## Live Deployment

| Service | URL |
|---------|-----|
| **Frontend** | https://kavachdocs.vercel.app |
| **API Docs** | https://kavachdocs-backend.onrender.com/docs |

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@kavachdocs.in | Admin@123 |
| Investigation Officer | officer@kavachdocs.in | Officer@123 |
| Legal Officer | legal@kavachdocs.in | Legal@123 |
| Viewer | viewer@kavachdocs.in | Viewer@123 |

---

## Problem Statement

**SIH26190 — Secure Digital Document Management System for Legal and Investigation Documents**

Legal and investigation departments handle sensitive records: FIRs, police reports, witness statements, charge sheets, court filings, evidence records, and forensic reports. Traditional systems suffer from unauthorized access, tampering, poor audit history, weak evidence tracking, and integrity issues.

KavachDocs addresses these through a centralized, security-focused platform.

---

## Objectives

- Securely store legal and investigation documents
- Enforce role-based access control
- Prevent unauthorized access
- Verify document integrity using SHA-256
- Detect tampering
- Maintain a tamper-evident audit trail
- Track evidence chain of custody
- Enable controlled collaboration

---

## Key Features

### Authentication
- JWT-based authentication
- bcrypt password hashing
- Protected API endpoints
- Failed-login tracking

### Role-Based Access Control
Enforced at the backend for every protected endpoint.

Roles: `ADMIN` · `INVESTIGATION_OFFICER` · `LEGAL_OFFICER` · `VIEWER`

### Case Management
- Create and view authorized cases
- Case type, priority, status
- Assigned officer tracking

### Secure Document Management
- Upload and download documents
- Auto-classification via AI
- Version tracking
- SHA-256 hashing on upload
- Persistent storage in PostgreSQL (BYTEA)

### Document Integrity
Each document receives a SHA-256 hash:


Verification:
Here's the remaining part of the README — from **Verification** onwards. Copy and append to your file.

```markdown
Verification:

```
Original Hash = Current Hash → INTEGRITY VERIFIED
Original Hash ≠ Current Hash → INTEGRITY VIOLATION
```

> SHA-256 provides cryptographic integrity and tamper detection. It does not independently establish legal authenticity.
```
### Tamper-Evident Audit Chain

Every action is logged and linked to the previous entry:

```
Event 1 → Event 2 → Event 3 → Event 4
```

Each event stores user, action, result, entity, timestamp, previous hash, and current hash. Modifying any past event breaks the chain.

### Security Events

- Auto-generated on blocked actions
- Severity: `LOW` · `MEDIUM` · `HIGH` · `CRITICAL`
- Admin-only resolve workflow

### AI Document Classifier

Auto-detects type from filename and title: FIR, Witness Statement, Investigation Report, Evidence Record, Forensic Report, Charge Sheet, Court Filing, Legal Notice, Medical Report, Photograph, Audio, Video, Other.

### Dashboard

Real-time totals for cases, documents, and security events, plus recent activity from audit logs.

---

## Architecture

```
Frontend (React + Vite) → Backend (FastAPI) → PostgreSQL (Neon) + BYTEA file storage
```

---

## Technology Stack

| Layer | Tools |
|-------|-------|
| Frontend | React, Vite, JavaScript, Tailwind CSS, Axios, React Router |
| Backend | Python, FastAPI, SQLAlchemy 2.0, Pydantic |
| Database | PostgreSQL (Neon — cloud), SQLite (local) |
| Security | JWT, bcrypt, SHA-256, RBAC |
| Deployment | Vercel, Render, Neon, UptimeRobot |

---

## Project Structure

```
SIH26190_KavachDocs/
├── Frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── main.jsx
│   ├── public/
│   ├── vercel.json
│   └── package.json
│
├── backend/
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   ├── seed_data.py
│   ├── models/
│   ├── schemas/
│   ├── security/
│   ├── services/
│   ├── routers/
│   ├── ai/
│   └── requirements.txt
│
├── README.md
└── LICENSE
```

---

## Database Schema

Core tables: `users` · `cases` · `documents` · `document_versions` · `audit_logs` · `security_events`

```
Users
├── Cases
│   ├── Documents → Document Versions
│   └── Audit Logs
├── Security Events
└── Audit Logs
```

---

## Core API

| Group | Endpoints |
|-------|-----------|
| **Auth** | `POST /auth/login` · `POST /auth/register` · `GET /auth/me` |
| **Cases** | `GET /cases` · `POST /cases` · `GET /cases/{id}` |
| **Documents** | `POST /documents/upload` · `GET /documents` · `GET /documents/{id}` · `GET /documents/{id}/download` · `POST /documents/{id}/verify` · `POST /documents/{id}/version` · `GET /documents/{id}/versions` |
| **Audit** | `GET /audit-logs` |
| **Security** | `GET /security-events` · `POST /security-events/{id}/resolve` |
| **Health** | `GET /health` |

Full docs: [Swagger UI](https://kavachdocs-backend.onrender.com/docs)

---

## Security

### File Security

- MIME type captured on upload
- Files stored as BYTEA in PostgreSQL
- No public file URLs
- Backend authorization on every download
- SHA-256 hash on every upload and version

### Authentication

- bcrypt password hashing (12 rounds)
- JWT tokens with 8-hour expiry
- Token validation on every request
- Auth-event logging

### Authorization Flow

```
Request → Authenticate (JWT) → Check Role (RBAC) → ALLOW / DENY
If DENY → Log + Create Security Event
```

---

## Demo Workflow

```
1.  Login as Admin
2.  View Dashboard (real stats from Neon)
3.  Create Case
4.  Upload Document
5.  Auto-classify + Generate SHA-256 Hash
6.  Verify Integrity → VERIFIED
7.  Download Document
8.  Logout → Login as Viewer
9.  Attempt Upload → ACCESS DENIED
10. Login back as Admin
11. View Security Events (auto-created)
12. Resolve Security Event
13. View Audit Trail (hash chain)
```

### Tampering Demo

Modify a document hash → verify → INTEGRITY VIOLATION.

---

## Sample Data

Only synthetic or fictional data is used. Do not upload real FIRs, police records, investigation documents, witness information, or sensitive personal data.

---

## MVP — What Has Been Built

### Completed (P0)

- JWT Authentication & bcrypt Hashing
- Role-Based Access Control (4 roles)
- Case CRUD
- Document Upload, Download, Verify, Versioning
- SHA-256 Integrity Verification
- Hash-Chained Audit Logs
- Auto-Generated Security Events
- AI Document Classifier
- Frontend (React + Vite + Tailwind)
- Dashboard, Audit Logs, Security Events UI
- Persistent File Storage (BYTEA)
- Auto-Seed on Startup
- Full Cloud Deployment
- UptimeRobot Health Monitoring

### Planned (P1 / P2)

- OCR and full-text search
- Advanced filters
- In-browser document preview
- Digital signatures
- Blockchain-backed verification
- Government API integration
- Mobile app

---

## MVP Limitations

KavachDocs is an SIH prototype. It does **not** claim:

- Production government deployment
- Legal certification
- Real police or MHA integration
- Legal authenticity based solely on SHA-256
- Handling real classified records

Official integrations require approvals, credentials, and compliance.

---

## Local Setup

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API docs: `http://127.0.0.1:8000/docs`

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

App: `http://localhost:5173`

---

## Environment Variables

**`backend/.env`**

```
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=480
DATABASE_URL=sqlite:///./kavachdocs.db
STORAGE_PATH=./storage
```

**`Frontend/.env`**

```
VITE_API_URL=http://localhost:8000
```

Never commit `.env`. Use `.env.example` for structure.

---

## Deployment Architecture

| Component | Platform |
|-----------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | Neon PostgreSQL |
| Uptime Monitor | UptimeRobot |

---

## Future Vision

Government identity integration · Digital signatures · Blockchain-backed verification · Advanced OCR · AI-assisted classification · Semantic search · Automated alerts · Inter-department collaboration · Mobile app · Forensic workflows.

---

## Team

**Team Sentinel**

Developed for **Smart India Hackathon 2026**.

---

## License

Developed as an academic and hackathon prototype. See `LICENSE`.

---

## Disclaimer

KavachDocs is a Smart India Hackathon prototype created for demonstration. All records shown are fictional or synthetic. It must not be used for real sensitive legal, police, investigation, or classified information without proper security audits, authorization, and compliance.
```
