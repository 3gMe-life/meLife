# 3G MeLife Backend API

Node.js, Express, and TypeScript REST API service for 3G MeLife.

---

## 📁 Architecture

```
backend/
├── src/
│   ├── config/              # Validated environment variables (Zod) and app configuration
│   ├── modules/             # Domain modules (auth, users, students, assessments, reports, etc.)
│   ├── middleware/          # Security, error handling, request-id, not-found
│   ├── routes/              # Central route registry (/api/v1)
│   ├── common/              # AppError, HTTP constants, types, Pino logger
│   ├── app.ts               # Express app factory (middleware, security, routing)
│   └── server.ts            # Server entrypoint with graceful shutdown
├── tests/                   # Integration and unit tests
├── .env                     # Local environment file
├── .env.example             # Safe environment template
├── nodemon.json             # Dev server config (tsx)
├── tsconfig.json            # Strict TypeScript configuration
└── package.json
```

---

## 🛠️ Scripts

- `npm run dev` — Starts the development server with live reload via `nodemon` + `tsx`
- `npm run build` — Compiles TypeScript into `dist/`
- `npm start` — Runs the compiled production server from `dist/server.js`
- `npm run typecheck` — Runs TypeScript type-checking without emitting files
- `npm run lint` — Runs ESLint across `src/`

---

## 🔒 Security Architecture

- **Helmet**: Secures HTTP response headers and disables X-Powered-By
- **CORS**: Domain-controlled access for frontend client (`FRONTEND_URL`)
- **Rate Limiting**: IP rate limiting to prevent brute-force attacks
- **Request ID**: `X-Request-Id` correlation for all requests and structured logs
- **Pino Logging**: High-performance structured logging with sensitive field redaction
- **Centralized Error Handling**: Safe `AppError` architecture preventing raw stack leakages in production
