# ⚖️ Lexora AI — Intelligent Contract Review Assistant
> **Transform complex contracts into clear, actionable insights with AI.**

**Lexora AI** is a full-stack AI-powered contract review platform that helps users understand lengthy and complex legal documents without manually reading every clause.

Users can upload contracts and receive an automated analysis containing **executive summaries, extracted clauses, risk assessment, important dates, obligations, and contract insights**, followed by a professionally generated PDF report.

---

## 🌐 Live Application

### 🚀 https://lexora-ai-app.vercel.app/

**Frontend:** React + Vite deployed on Vercel
**Backend:** Node.js + Express deployed on Render
**Database:** MongoDB Atlas
**AI Engine:** Google Gemini

---

## ✨ Key Features

### 🔐 User Authentication

* User registration and login
* JWT-based authentication
* Protected API endpoints
* User-specific contract access
* Secure session-based frontend workflow

### 📄 Contract Management

* Upload contract documents
* Create and manage contracts
* View user's contract library
* Delete contracts
* Track contract metadata

### 🗂️ Contract Versioning

* Maintain multiple versions of a contract
* Automatically increment version numbers
* Track upload timestamps
* Identify the current/latest version
* View historical versions

### 🤖 AI Contract Analysis

Lexora analyzes uploaded contract content using Google Gemini and extracts meaningful information such as:

* Document type
* Parties involved
* Effective date
* Expiration date
* Payment terms
* Termination clauses
* Confidentiality clauses
* Renewal terms
* Governing law
* Jurisdiction
* Executive summary

### ⚠️ Risk Analysis

Contracts are evaluated to identify potential areas of concern.

The platform provides:

* Overall risk score
* Risk level
* Risk statistics
* Clause-level risk information
* Critical clause identification
* Contract health assessment

### 📅 Important Dates & Obligations

Lexora extracts contract-related events including:

* Effective dates
* Expiration dates
* Renewal periods
* Notice periods
* Deadlines
* Contractual obligations

This allows users to quickly identify important commitments and dates hidden inside lengthy documents.

### 📊 Contract Insights

The analysis dashboard provides structured information rather than returning raw AI-generated text.

Users can explore:

* Executive summary
* Key clauses
* Risk details
* Timeline
* Obligations
* Contract statistics
* Important terms

### 📑 Professional PDF Reports

Generate a downloadable contract review report containing:

* Contract information
* Executive summary
* Risk assessment
* Important terms
* Timeline
* Obligations
* Key clauses
* Clause-level risk details
* Final contract assessment

---

# 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      User / Client   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   React + Vite UI    │
                    │      Vercel          │
                    └──────────┬───────────┘
                               │
                         REST API / JWT
                               │
                               ▼
                    ┌──────────────────────┐
                    │  Node.js + Express   │
                    │       Render         │
                    └──────────┬───────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
       ┌───────────┐    ┌─────────────┐   ┌─────────────┐
       │ MongoDB   │    │ Contract    │   │ Gemini AI   │
       │   Atlas   │    │  Analysis   │   │   Engine    │
       └───────────┘    └─────────────┘   └─────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   PDF Report Engine  │
                    └──────────────────────┘
```

---

# 🔄 Application Workflow

```text
User
 │
 ▼
Register / Login
 │
 ▼
JWT Authentication
 │
 ▼
Upload Contract
 │
 ▼
PDF Text Extraction
 │
 ▼
AI Analysis using Gemini
 │
 ├── Contract Summary
 ├── Clause Extraction
 ├── Risk Analysis
 ├── Important Dates
 └── Obligations
 │
 ▼
Store Analysis + Version
 │
 ▼
Interactive Analysis Dashboard
 │
 ▼
Generate Professional PDF Report
```

---

# 🧩 Backend Architecture

Lexora follows a layered backend architecture:

```text
Route
  ↓
Controller
  ↓
Service
  ↓
DAO
  ↓
Model
  ↓
MongoDB
```

### Routes

Responsible for:

* Endpoint definitions
* HTTP methods
* Middleware
* Request mapping

### Controllers

Responsible for:

* Request validation
* Calling services
* HTTP responses
* Error handling

### Services

Responsible for:

* Business logic
* Contract analysis workflow
* Version management
* Report preparation

### DAO

Responsible for:

* Database operations
* Queries
* Creating and retrieving contracts
* Version management

### Models

Define MongoDB/Mongoose schemas for:

* Users
* Contracts
* Contract versions

This separation keeps the backend modular and easier to maintain.

---

# 📁 Project Structure

```text
lexora-ai/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   └── ...
│   │
│   ├── .env.example
│   └── package.json
│
├── server/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── contractController.js
│   │   ├── analysisController.js
│   │   └── reportController.js
│   │
│   ├── dao/
│   │   ├── userDao.js
│   │   ├── contractDao.js
│   │   └── analysisDao.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Contract.js
│   │   └── ContractVersion.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── contractRoutes.js
│   │   ├── versionRoutes.js
│   │   ├── analysisRoutes.js
│   │   └── reportRoutes.js
│   │
│   ├── services/
│   │   ├── authService.js
│   │   ├── contractService.js
│   │   ├── analysisService.js
│   │   └── reportService.js
│   │
│   ├── swagger/
│   │   └── swagger.js
│   │
│   ├── pdf-parser.cjs
│   └── server.js
│
└── README.md
```

---

# 🛠️ Tech Stack

| Layer               | Technology        |
| ------------------- | ----------------- |
| Frontend            | React             |
| Build Tool          | Vite              |
| Backend             | Node.js           |
| API Framework       | Express.js        |
| Database            | MongoDB Atlas     |
| ODM                 | Mongoose          |
| Authentication      | JWT               |
| AI                  | Google Gemini     |
| Document Processing | PDF Parser        |
| PDF Reports         | PDFKit            |
| API Documentation   | Swagger / OpenAPI |
| Frontend Deployment | Vercel            |
| Backend Deployment  | Render            |

---

# 🔌 API Overview

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

### Contracts

```http
POST   /api/contracts
GET    /api/contracts
GET    /api/contracts/:id
DELETE /api/contracts/:id
```

### Contract Versions

```http
GET /api/contracts/:id/versions
GET /api/versions/:id
```

### AI Analysis

```http
POST /api/analyze
GET  /api/contracts/:id/analysis
```

### Reports

```http
GET /api/contracts/:id/report
```

### API Documentation

Swagger documentation is available at:

```text
/api-docs
```

---

# 🔐 Security

Lexora implements several security practices:

* JWT-based authentication
* Protected contract APIs
* User-specific contract ownership
* Authorization checks for contract resources
* Environment variables for sensitive credentials
* Gemini API key kept on the backend
* MongoDB credentials kept server-side
* CORS configuration for deployed frontend
* No sensitive AI credentials exposed to the React client

---

# ⚙️ Local Development

## 1. Clone the repository

```bash
git clone https://github.com/neola-dev/contract-review-assist.git
cd contract-review-assist
```

## 2. Install backend dependencies

```bash
cd server
npm install
```

## 3. Configure environment variables

Create a `.env` file inside `server/`:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.6-flash
PORT=3001
```

## 4. Start backend

```bash
npm start
```

Backend:

```text
http://localhost:3001
```

Swagger:

```text
http://localhost:3001/api-docs
```

## 5. Start frontend

```bash
cd ../client
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Configure:

```env
VITE_API_URL=http://localhost:3001
```

---

# ☁️ Deployment

Lexora uses a production deployment architecture:

```text
GitHub
   │
   ├──────────────► Vercel
   │                  │
   │                  ▼
   │             React Frontend
   │
   └──────────────► Render
                      │
                      ▼
                 Express Backend
                      │
             ┌────────┴────────┐
             ▼                 ▼
        MongoDB Atlas       Gemini API
```

### Production Environment

**Frontend**

```text
https://lexora-ai-app.vercel.app
```

**Backend**

```text
https://contract-review-assist.onrender.com
```

---

# 📈 What This Project Demonstrates

Lexora AI demonstrates practical experience in:

* Full-stack web development
* REST API design
* React application architecture
* Node.js and Express
* MongoDB data modeling
* Mongoose
* JWT authentication
* Authorization
* AI/LLM API integration
* Structured AI responses
* Document processing
* Contract version management
* PDF generation
* Swagger/OpenAPI documentation
* Layered backend architecture
* Cloud deployment
* Vercel + Render integration
* Environment configuration
* CORS handling

---

# 🚀 Future Enhancements

Potential future improvements include:

* OCR support for scanned contracts
* More advanced document classification
* Improved clause risk models
* Multi-document analysis
* Role-based access control
* Organization/workspace support
* Audit logs
* Advanced analytics
* Cloud document storage
* Email notifications for important deadlines

---

# ⚠️ Disclaimer

Lexora AI is an AI-assisted contract analysis tool intended to help users understand and review contract documents.

It **does not provide legal advice** and should not replace review by a qualified legal professional.

AI-generated results may contain inaccuracies and should be independently verified.

---

# 👨‍💻 Author

### Neola

**BE Computer Science & Engineering**

Interested in building scalable full-stack applications, backend systems, and practical AI-powered software.

---

## ⭐ If you find Lexora AI interesting

Feel free to explore the project, try the live application, or check out the source code.

**Built with React, Node.js, MongoDB, and Gemini AI.**
