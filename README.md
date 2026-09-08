# KavachDocs

### Secure Digital Document & Case Management System

> **Secure Documents. Trusted Evidence.**

KavachDocs is a secure digital platform designed for managing **legal and investigation documents, cases, and evidence** in a centralized environment.

It focuses on **secure access, document integrity, audit trails, and evidence chain of custody**.

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

Traditional or fragmented document management can create challenges such as:

* Unauthorized access
* Unauthorized modification
* Difficult document retrieval
* Lack of complete audit history
* Weak evidence tracking
* Collaboration and access-control issues
* Maintaining document integrity

KavachDocs addresses these challenges through a centralized, security-focused platform.

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
* Provide fast case, document and evidence search
* Maintain document versions
* Enable controlled collaboration between authorized users

---

## 🚀 Key Features

### 🔐 Authentication

* JWT-based authentication
* Secure password hashing
* Protected API endpoints
* Failed-login tracking

### 👥 Role-Based Access Control

Supported roles:

* `ADMIN`
* `INVESTIGATOR`
* `SENIOR_OFFICER`
* `FORENSIC_OFFICER`
* `LEGAL_OFFICER`

Authorization is enforced at the backend level.

### 📁 Case Management

* Create cases
* View authorized cases
* Update cases
* Assign case members
* Track case status
* Manage case documents and evidence

### 📄 Secure Document Management

* Upload documents
* Store document metadata
* Secure document download
* Document version tracking
* File type validation
* File size limits
* UUID-based storage filenames
* Private file storage

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

Important activities are recorded, including:

* Login
* Failed login
* Case creation
* Document upload
* Document access
* Document download
* Document modification
* Evidence transfer
* Integrity verification
* Unauthorized access attempts

### 🔗 Tamper-Evident Audit Chain

Audit events are connected using cryptographic hashes.

```text
Event 1
  ↓
Event 2
  ↓
Event 3
  ↓
Event 4
```

Each event contains:

* User
* Action
* Entity
* Timestamp
* Previous hash
* Event hash

The chain can be verified to detect unexpected modification.

### 🧪 Evidence Management

Evidence records include:

* Evidence ID
* Case ID
* Evidence type
* Description
* Collector
* Collection time
* Current custodian
* Status

### 🔄 Chain of Custody

Evidence transfers are recorded between authorized users.

```text
Officer A
   ↓
Evidence Transfer
   ↓
Officer B
   ↓
Evidence Transfer
   ↓
Officer C
```

Each transfer records:

* From user
* To user
* Timestamp
* Reason
* Notes
* Transfer hash

### 🔎 Search

Search authorized records using:

* Case number
* FIR number
* Document title
* Document type
* Evidence ID
* Officer
* Keywords

### 📊 Dashboard

The dashboard displays:

* Total cases
* Total documents
* Total evidence
* Recent activities
* Security events
* Integrity verification status

---

## 🏗️ Architecture

```text
              ┌──────────────────┐
              │     Frontend     │
              │ React + Vite +   │
              │       CSS        │
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
              │   + SQLAlchemy   │
              └──────────────────┘
                      │
              ┌───────▼──────────┐
              │  Private File    │
              │     Storage      │
              └──────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend

* React
* Vite
* JavaScript
* CSS

### Backend

* Python
* FastAPI
* SQLAlchemy

### Database

* PostgreSQL

### Security

* JWT
* Argon2
* SHA-256
* Role-Based Access Control

### Development

* Node.js + npm
* Git
* GitHub
* VS Code

### Deployment

* Vercel
* Render

---

## 📂 Project Structure

```text
kavachdocs/
│
├── frontend/
│
├── backend/
│   ├── app/
│   └── tests/
│
├── storage/
│
├── sample-data/
│
├── docs/
│
├── screenshots/
│
├── presentation/
│
├── .env.example
├── .gitignore
├── README.md
└── LICENSE
```

---

## 🗄️ Database

Core tables:

```text
users
cases
case_members
documents
document_versions
evidence
evidence_transfers
audit_logs
```

Relationship:

```text
Users
  │
  ├── Cases
  │     ├── Case Members
  │     ├── Documents
  │     │     └── Versions
  │     ├── Evidence
  │     │     └── Transfers
  │     └── Audit Logs
  │
  └── Audit Logs
```

---

## 🔌 Core API

### Authentication

```text
POST /auth/login
```

### Cases

```text
GET  /cases
POST /cases
GET  /cases/{id}
PUT  /cases/{id}
```

### Documents

```text
POST /cases/{id}/documents
GET  /documents/{id}
GET  /documents/{id}/download
GET  /documents/{id}/versions
POST /documents/{id}/verify-integrity
```

### Evidence

```text
GET  /cases/{id}/evidence
POST /evidence
GET  /evidence/{id}
POST /evidence/{id}/transfer
```

### Audit

```text
GET  /cases/{id}/audit
POST /audit/verify-chain
```

### Search

```text
GET /search
```

### Dashboard

```text
GET /dashboard/stats
```

---

## 🔒 Security

KavachDocs follows basic secure-development practices.

### File Security

* Allowed file extensions
* File type validation
* File size limits
* Generated filenames
* UUID-based storage names
* Private storage
* Backend authorization
* Path traversal protection
* No sensitive files in GitHub

### Authentication

* Password hashing
* JWT authentication
* Protected routes
* Token validation
* Authentication-event logging

### Authorization

Every sensitive resource is checked on the backend.

```text
User Request
     ↓
Authenticate
     ↓
Check Role
     ↓
Check Case Access
     ↓
ALLOW / DENY
```

---

## 🧪 Demo Workflow

```text
1. Login
      ↓
2. Open Case
      ↓
3. Upload Investigation Document
      ↓
4. Generate SHA-256 Hash
      ↓
5. View Document
      ↓
6. Verify Integrity
      ↓
7. INTEGRITY VERIFIED
      ↓
8. Attempt Unauthorized Access
      ↓
9. ACCESS DENIED
      ↓
10. View Audit Trail
      ↓
11. Add Evidence
      ↓
12. Transfer Evidence
      ↓
13. View Chain of Custody
      ↓
14. Verify Audit Chain
```

### Optional Tampering Demonstration

Modify a sample document after upload and run integrity verification.

```text
Original Hash ≠ Current Hash
          ↓
INTEGRITY VIOLATION
```

---

## 📦 Sample Data

Only **synthetic/fictional demonstration data** should be used.

Do not upload real:

* FIRs
* Police records
* Investigation documents
* Witness information
* Forensic records
* Sensitive personal information

to the public repository or demo environment.

---

## ⚡ MVP Scope

### P0 — Must Have

* Authentication
* RBAC
* Case management
* Document upload
* Secure document access
* SHA-256 integrity verification
* Audit logging
* Hash-chained audit trail
* Evidence management
* Chain of custody
* Search
* Dashboard
* Security testing
* Deployment

### P1 — Only If Time Permits

* OCR
* Extracted-text search
* Advanced filters
* Document preview
* Security alerts

### P2 — Future

* Blockchain-backed verification
* Advanced AI
* Intelligent document classification
* Advanced forensic analytics
* Digital signatures
* Government API integration
* Enterprise infrastructure

---

## 🚫 MVP Limitations

KavachDocs is an **SIH prototype/MVP**.

It does not currently claim:

* Production government deployment
* Legal certification
* Real police/MHA database integration
* Legal authenticity based solely on SHA-256
* Production blockchain infrastructure
* Handling real classified or sensitive investigation records

Official integrations would require appropriate APIs, credentials, approvals, infrastructure and security compliance.

---

## 💻 Local Setup

### Clone Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd kavachdocs
```

### Backend

```bash
cd backend
python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run:

```bash
uvicorn app.main:app --reload
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables

Create a local `.env` file.

Example:

```env
DATABASE_URL=
JWT_SECRET=
JWT_ALGORITHM=
ACCESS_TOKEN_EXPIRE_MINUTES=
STORAGE_PATH=
```

**Never commit `.env` to GitHub.**

Use `.env.example` for configuration structure.

---

## 🧪 Testing

Basic testing includes:

* Authentication testing
* RBAC testing
* Unauthorized-access testing
* File validation testing
* Path traversal testing
* Document integrity testing
* Audit-chain verification
* Evidence-transfer testing

Backend tests:

```bash
pytest
```

API testing can also be performed using FastAPI Swagger/OpenAPI.

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
          ┌──────┴──────┐
          ▼             ▼
   ┌────────────┐  ┌─────────────┐
   │ PostgreSQL │  │File Storage │
   └────────────┘  └─────────────┘
```

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

This project is developed as an academic and hackathon prototype.

See `LICENSE` for details.

---

## ⚠️ Disclaimer

KavachDocs is a **Smart India Hackathon prototype** created for demonstration and evaluation purposes.

All demonstration records should be fictional/synthetic. The system should not be used for real sensitive legal, police, investigation, forensic or classified information without appropriate security audits, authorization, compliance and official approval.
