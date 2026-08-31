# 3G MeLife — Psychometric Assessment & Career Guidance Platform

Multi-dimensional psychometric assessment and career-guidance platform empowering students to discover their authentic strengths and navigate educational transitions with scientific confidence.

---

## 🏗️ Repository Architecture

```
melife/
├── frontend/          # Next.js 16 (App Router, React 19, Tailwind CSS v4, TypeScript)
├── backend/           # Node.js + Express + TypeScript REST API (v1)
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### 1. Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Runs on **`http://localhost:3000`**.

### 2. Backend (Express API)

```bash
cd backend
npm install
npm run dev
```

Runs on **`http://localhost:5000`** with base endpoint **`http://localhost:5000/api/v1`**.

---

## 🩺 Health Check

```bash
curl http://localhost:5000/api/v1/health
```

Expected Response:
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "service": "melife-api",
    "version": "v1",
    "timestamp": "2026-08-31T..."
  }
}
```
