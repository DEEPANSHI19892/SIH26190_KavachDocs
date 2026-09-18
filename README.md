```markdown
## KavachDocs

### Secure Digital Document & Case Management System

> **Secure Documents. Trusted Evidence.**

KavachDocs is a secure digital platform for managing **legal and investigation documents, cases, and evidence** in a centralized environment.

It focuses on **secure access, cryptographic document integrity, tamper-evident audit trails, role-based access control, and evidence chain of custody**.

---

## 🌐 Live Deployment

| Service | URL |
|---------|-----|
| **Frontend (App)** | [https://kavachdocs.vercel.app] |
| **Backend API Docs** | [https://kavachdocs-backend.onrender.com/docs] |

### 🔑 Demo Credentials

Click any role on the login page to auto-fill credentials.

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@kavachdocs.in` | `Admin@123` |
| Investigation Officer | `officer@kavachdocs.in` | `Officer@123` |
| Legal Officer | `legal@kavachdocs.in` | `Legal@123` |
| Viewer | `viewer@kavachdocs.in` | `Viewer@123` |

---

## 📌 Problem Statement

**SIH26190 — Secure Digital Document Management System for Legal and Investigation Documents**

Legal and investigation departments handle sensitive records such as:

* FIRs
* Police reports
* Investigation records
* Witness statements
* Charge sheets
* Court filings
* Evidence records
* Forensic reports
* Legal notices and judgments

Traditional or fragmented document management creates challenges such as:

* Unauthorized access
* Unauthorized modification
* Difficult document retrieval
* Lack of complete audit history
* Weak evidence tracking
* Collaboration and access-control issues
* Maintaining document integrity

KavachDocs addresses these through a centralized, security-focused platform.

---

## 🎯 Objectives

KavachDocs aims to:

* Securely store legal and investigation documents
* Provide role-based access control
* Prevent unauthorized access
* Verify document integrity using SHA-256
* Detect document tampering
* Maintain a tamper-evident audit trail
* Track evidence through chain of custody
* Maintain document versions
* Enable controlled collaboration between authorized users

---

## 🚀 Key Features

### 🔐 Authentication
* JWT-based authentication
* bcrypt password hashing
* Protected API endpoints
* Failed-login tracking
* Auto-logout on token expiry

### 👥 Role-Based Access Control
Enforced at the backend level for every protected endpoint.

Supported roles:
* `ADMIN`
* `INVESTIGATION_OFFICER`
* `LEGAL_OFFICER`
* `VIEWER`

### 📁 Case Management
* Create cases
* View authorized cases
* Case types, priority, status
* Assigned officer tracking
* Case-level document aggregation

### 📄 Secure Document Management
* Upload documents
* Auto-classification of document type (AI)
* Secure download (bytes served from DB)
* Document version tracking
* SHA-256 hashing on upload
* Persistent storage in PostgreSQL (BYTEA)

### 🔏 Document Integrity

Each uploaded document receives a **SHA-256 hash**.

```text
Document
   ↓
SHA-256 Hash
   ↓
Stored Integrity Hash
```

During verification:

```text
Original Hash = Current Hash
        ↓
INTEGRITY VERIFIED
```

If the document has been modified:

```text
Original Hash ≠ Current Hash
        ↓
INTEGRITY VIOLATION
```

> SHA-256 provides cryptographic integrity verification and tamper detection. It does not independently establish legal authenticity.

### 🧾 Audit Trail

Every important activity is recorded, including:

* Login / failed login
* Case creation
* Document upload
* Document view
* Document download
* Document verification
* Version creation
* Unauthorized access attempts

### 🔗 Tamper-Evident Audit Chain

Audit events are linked using cryptographic hashes.

```text
Event 1 → Event 2 → Event 3 → Event 4
```

Each event contains:
* User ID
* Action
* Result (SUCCESS / FAILED / BLOCKED)
* Entity references (case, document)
* Timestamp
* Previous hash
* Current hash

Modifying any historical event breaks the chain.

### 🚨 Security Events
* Auto-generated on blocked actions
* Severity classification (LOW / MEDIUM / HIGH / CRITICAL)
* Admin-only resolution workflow
* Full RBAC-triggered alerting

### 🤖 AI Document Classifier
Auto-detects document type from filename + title:
* FIR / Witness Statement / Investigation Report / Evidence Record / Forensic Report / Charge Sheet / Court Filing / Legal Notice / Medical Report / Photograph / Audio / Video / Other

### 🔎 Search
Search authorized records using case number, document title, document type, or keywords.

### 📊 Dashboard
Displays:
* Total cases
* Total documents
* Total security events
* Recent activity feed (from audit logs)

---

## 🏗️ Architecture

```text
              ┌──────────────────┐
              │     Frontend     │
              │ React + Vite +   │
              │     Tailwind     │
              └────────┬─────────┘
                       │
                    REST API
                       │
              ┌────────▼─────────┐
              │     Backend      │
              │ Python + FastAPI │
              └───────┬──────────┘
                      │
              ┌───────▼──────────┐
              │   PostgreSQL     │
              │   (Neon Cloud)   │
              │   + SQLAlchemy   │
              └───────┬──────────┘
                      │
              ┌───────▼──────────┐
              │  File Bytes in   │
              │  BYTEA column    │
              └──────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend
* React
* Vite
* JavaScript
* Tailwind CSS
* Axios
* React Router

### Backend
* Python
* FastAPI
* SQLAlchemy 2.0
* Pydantic

### Database
* PostgreSQL (Neon — cloud)
* SQLite (local development)

### Security
* JWT (python-jose)
* bcrypt
* SHA-256
* Role-Based Access Control

### Deployment
* Vercel (frontend)
* Render (backend)
* Neon (database)
* UptimeRobot (health monitoring)

### Development
* Node.js + npm
* Git + GitHub
* VS Code

---

## 📂 Project Structure

```text
SIH26190_KavachDocs/
│
├── Frontend/
│   ├── src/
│   │   ├── api/               # axios.js, endpoints.js
│   │   ├── components/        # auth, cases, documents, common
│   │   ├── context/           # AuthContext
│   │   ├── pages/             # Dashboard, Cases, Documents, Audit, Security
│   │   └── main.jsx
│   ├── public/
│   │   └── favicon.svg
│   ├── vercel.json            # SPA routing
│   └── package.json
│
├── backend/
│   ├── main.py                # FastAPI app + auto-seed
│   ├── config.py
│   ├── database.py
│   ├── seed_data.py
│   ├── models/                # SQLAlchemy models
│   ├── schemas/               # Pydantic schemas
│   ├── security/              # JWT, hashing, RBAC
│   ├── services/              # Business logic
│   ├── routers/               # API endpoints
│   ├── ai/                    # Document classifier
│   ├── storage/
│   └── requirements.txt
│
├── README.md
└── LICENSE
```

---

## 🗄️ Database

Core tables:

```text
users
cases
documents
document_versions
audit_logs
security_events
```

Relationship:

```text
Users
  │
  ├── Cases
  │     ├── Documents
  │     │     └── Document Versions
  │     └── Audit Logs
  │
  ├── Security Events
  └── Audit Logs
```

---

## 🔌 Core API

### Authentication
```text
POST /auth/login
POST /auth/register      (Admin only)
GET  /auth/me
```

### Cases
```text
GET  /cases
POST /cases
GET  /cases/{id}
```

### Documents
```text
POST /documents/upload
GET  /documents
GET  /documents/{id}
GET  /documents/{id}/download
POST /documents/{id}/verify
POST /documents/{id}/version
GET  /documents/{id}/versions
```

### Audit & Security
```text
GET  /audit-logs
GET  /security-events
POST /security-events/{id}/resolve    (Admin only)
```

### Health
```text
GET /health
```

Full interactive API documentation: [Swagger UI](https://kavachdocs-backend.onrender.com/docs)

---

## 🔒 Security

### File Security
* MIME type captured on upload
* Files stored as BYTEA in PostgreSQL
* Private DB storage — no public file URLs
* Backend authorization on every download
* SHA-256 hash on every upload
* Version-level hashing

### Authentication
* bcrypt password hashing (12 rounds)
* JWT authentication (8-hour expiry)
* Protected routes via dependency injection
* Token validation on every request
* Auth-event logging

### Authorization

Every sensitive resource is checked on the backend:

```text
User Request
     ↓
Authenticate (JWT)
     ↓
Check Role (RBAC)
     ↓
ALLOW / DENY
     ↓
If DENY → Log + Create Security Event
```

---

## 🧪 Demo Workflow

```text
1.  Login as Admin
        ↓
2.  View Dashboard (real stats from Neon)
        ↓
3.  Create Case
        ↓
4.  Upload Investigation Document
        ↓
5.  Auto-classify + Generate SHA-256 Hash
        ↓
6.  Verify Integrity → INTEGRITY VERIFIED
        ↓
7.  Download Document
        ↓
8.  Logout → Login as Viewer
        ↓
9.  Attempt Unauthorized Upload → ACCESS DENIED
        ↓
10. Login back as Admin
        ↓
11. View Security Events (auto-created)
        ↓
12. Resolve Security Event
        ↓
13. View Audit Trail (with hash chain)
```

### Optional Tampering Demo
Modify a document hash in DB → run integrity verification.

```text
Original Hash ≠ Current Hash
          ↓
INTEGRITY VIOLATION
```

---

## 📦 Sample Data

Only **synthetic / fictional demonstration data** is used.

**Do not upload real:**
* FIRs
* Police records
* Investigation documents
* Witness information
* Forensic records
* Sensitive personal information

to the public repository or demo environment.

---

## ✅ MVP — What Has Been Built

### Completed (P0)

| Feature | Status |
|---------|--------|
| JWT Authentication | ✅ |
| bcrypt Password Hashing | ✅ |
| Role-Based Access Control (4 roles) | ✅ |
| Case CRUD | ✅ |
| Document Upload | ✅ |
| Document Download | ✅ |
| SHA-256 Integrity Verification | ✅ |
| Document Versioning | ✅ |
| Hash-Chained Audit Logs | ✅ |
| Security Events (auto-generated) | ✅ |
| AI Document Classifier | ✅ |
| Frontend (React + Vite) | ✅ |
| Dashboard with Real Stats | ✅ |
| Audit Logs UI | ✅ |
| Security Events UI with Resolve | ✅ |
| Demo Credentials Auto-fill | ✅ |
| Persistent File Storage (BYTEA) | ✅ |
| Auto-Seed on Startup | ✅ |
| Full Cloud Deployment | ✅ |
| Health Monitoring (UptimeRobot) | ✅ |

### Planned (P1 / P2)

* OCR / extracted-text search
* Advanced filters
* Document preview in-browser
* Digital signatures
* Blockchain-backed verification
* Government API integration
* Mobile application
* Advanced forensic analytics

---

## 🚫 MVP Limitations

KavachDocs is an **SIH prototype / MVP**.

It does not currently claim:
* Production government deployment
* Legal certification
* Real police / MHA database integration
* Legal authenticity based solely on SHA-256
* Production blockchain infrastructure
* Handling real classified or sensitive investigation records

Official integrations would require appropriate APIs, credentials, approvals, infrastructure, and security compliance.

---

## 💻 Local Setup

### Clone Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd SIH26190_KavachDocs
```

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate         # Windows
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

Frontend runs at: `http://localhost:5173`

---

## 🔐 Environment Variables

Create `backend/.env`:

```env
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=480
DATABASE_URL=sqlite:///./kavachdocs.db
STORAGE_PATH=./storage
```

Create `Frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```

**Never commit `.env` to GitHub.** Use `.env.example` for structure.

---

## 🧪 Testing

Basic testing includes:
* Authentication testing
* RBAC testing
* Unauthorized-access testing
* File validation testing
* Document integrity testing
* Audit-chain verification

API testing via FastAPI Swagger UI: `/docs`

---

## 🌐 Deployment

```text
              Users
                 │
                 ▼
          ┌─────────────┐
          │   Vercel    │
          │  Frontend   │
          └──────┬──────┘
                 │
                 ▼
          ┌─────────────┐
          │   Render    │
          │   FastAPI   │
          └──────┬──────┘
                 │
                 ▼
          ┌─────────────┐
          │    Neon     │
          │ PostgreSQL  │
          │ + BYTEA     │
          └─────────────┘
```

| Component | Platform | Purpose |
|-----------|----------|---------|
| Frontend | Vercel | Static React build (CDN) |
| Backend | Render | FastAPI service |
| Database | Neon | Managed PostgreSQL |
| Monitor | UptimeRobot | Keeps Render warm via `/health` pings |

---

## 🔮 Future Vision

KavachDocs can evolve into a complete secure digital ecosystem for investigation and legal workflows.

Possible future capabilities:
* Government identity integration
* Digital signatures
* Blockchain-backed verification
* Advanced OCR
* AI-assisted document classification
* Semantic search
* Automated security alerts
* Secure inter-department collaboration
* Mobile application
* Advanced forensic workflows

---

## 👥 Team

**Team Sentinel**

Developed for **Smart India Hackathon 2026**.

---

## 📄 License

Developed as an academic and hackathon prototype. See `LICENSE` for details.

---

## ⚠️ Disclaimer

KavachDocs is a **Smart India Hackathon prototype** created for demonstration and evaluation.

All demonstration records are fictional / synthetic. The system must not be used for real sensitive legal, police, investigation, forensic, or classified information without appropriate security audits, authorization, compliance, and official approval.
```
