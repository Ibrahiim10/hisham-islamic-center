# Hisham Islamic Center

Production-oriented madrasa management system for **Hisham Islamic Center**.

- **Visual source of truth:** Google Stitch project *Hisham Islamic Center Portal*
- **Stack:** React + Vite + Tailwind (frontend), Express + MongoDB + Mongoose (backend)

## Repository layout

```
frontend/   React admin portal (Stitch-aligned UI)
backend/    REST API
docs/       Design references and implementation plans
```

## Prerequisites

- Node.js 20+
- MongoDB (required from Phase 2 onward)

## Setup

```bash
npm install
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### MongoDB (Phase 2+)

Ensure MongoDB is running, then seed **development/demo data only**:

```bash
npm run seed -w backend
```

Optional: `SEED_CLEAR=true` in `backend/.env` wipes seeded collections before re-seeding (development only; blocked in production).

## Development

Run API and UI together:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Health check: http://localhost:5000/api/health
- Foundation connectivity page: http://localhost:5173/foundation

## Build & test

```bash
npm run build
npm run test
```

## Implementation status

See `docs/superpowers/plans/2026-10-01-hisham-islamic-center.md` for phased delivery.

**Completed:** Phase 1 — monorepo scaffold, Stitch design tokens, route placeholders, API health endpoint.

**Completed:** Phase 2 — MongoDB/Mongoose connection, domain models, indexes, development seed script.

**Next:** Phase 3 — Admin authentication (JWT, login, protected routes).
# hisham-islamic-center
# hisham-islamic-center
