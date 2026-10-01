# Hisham Islamic Center Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-quality madrasa management system for Hisham Islamic Center with Stitch-faithful UI and MongoDB-backed business logic, starting with Admin-only access.

**Architecture:** Monorepo with separate `frontend` (React/Vite/Tailwind) and `backend` (Express/Mongoose). REST API with JWT auth. Domain services own fee balance, attendance, and notification logic. Stitch HTML exports define Tailwind design tokens; live data always from API.

**Tech Stack:** React 18+, TypeScript, Vite, Tailwind, React Router, Axios, RHF, Zod, Recharts, Lucide; Node, Express, Mongoose, JWT, bcrypt, Helmet, CORS, rate-limit.

## Global Constraints

- Visual source of truth: Google Stitch project **Hisham Islamic Center Portal** (`9068708520721933874`).
- Brand anchors: Primary `#0D2F30`, accent `#A5815E` (map to Stitch `primary-container` / gold accents in UI).
- Admin-only role in v1; extensible RBAC later.
- No hard-coded class fees in application logic; use `FeeStructure` model.
- No invented Qur'an/Hadith; content from `IslamicContent` collection only.
- Backend calculates fees/outstanding; frontend displays API results.
- M-Pesa: manual recording v1; provider abstraction for future API.
- Notifications: `NotificationService` + mock SMS/WhatsApp providers.

---

## Stitch Design Inventory

| Screen | Stitch title | Route (planned) |
|--------|--------------|-----------------|
| Dashboard | Admin Dashboard | `/` |
| Students | Students Directory | `/students` |
| Fees | Fee Management & Payments | `/fees` |
| Qur'an | Qur'an & Islamic Learning | `/quran-learning` |
| Assets | Emblem SVG, admin portrait | `/assets` |

**Navigation (from Stitch):** Dashboard, Students, Attendance, Fees, Qur'an & Learning, Reports, Notifications, Settings, Sign Out.

**Design tokens:** Material-style palette in `docs/design-references/dashboard-stitch.html` — fonts Plus Jakarta Sans + Inter, sidebar `260px`, `bg-primary-container`, active nav `bg-secondary`.

---

## Folder Structure

```
Hisham Islamic Center/
  frontend/src/{components,pages,layouts,hooks,services,types,schemas,utils,context,routes,assets}
  backend/src/{controllers,models,routes,middleware,services,validators,utils,config,types}
  docs/design-references/
  docs/superpowers/plans/
```

---

## Database Model Plan

| Model | Purpose | Key fields / indexes |
|-------|---------|----------------------|
| User | Admin auth | email unique, passwordHash, role |
| Class | Sections | name, isActive |
| FeeStructure | Monthly fee per class | classId, amount, currency, effectiveFrom |
| Student | Enrollment | fullName index, classId, status, soft deactivate |
| Payment | Fee payments | studentId, month, year compound unique w/ partial rules, mpesaRef index |
| Attendance | Daily marks | studentId+date unique, date index |
| QuranLearningRecord | Hifz progress | studentId, juz, surah, notes |
| IslamicContent | Dashboard motivation | type quran|hadith, arabic, translation, source |
| Notification | Parent messages | studentId, channel, status, dedupe key |

---

## API Plan

REST under `/api`, JSON, Zod validation, centralized error handler, JWT on all routes except auth login.

Auth → Dashboard summary → Students CRUD → Classes/FeeStructure → Payments/Fees → Attendance → Reports → Notifications → Quran learning.

---

## Implementation Phases

- [x] **Phase 1:** Monorepo scaffold, configs, design token foundation, health check, route placeholders.
- [x] **Phase 2:** MongoDB, models, env, error handling.
- [ ] **Phase 3:** Auth (login, JWT, protected routes).
- [ ] **Phase 4:** App shell — Sidebar, Header, responsive layout, reusable UI primitives.
- [ ] **Phase 5:** Dashboard + summary API.
- [ ] **Phase 6:** Students + profile.
- [ ] **Phase 7:** Classes + fee structures.
- [ ] **Phase 8:** Fees + payments.
- [ ] **Phase 9:** Attendance.
- [ ] **Phase 10:** Qur'an / Islamic learning.
- [ ] **Phase 11:** Notifications (mock providers).
- [ ] **Phase 12:** Reports (CSV/PDF/print).
- [ ] **Phase 13:** Tests for core business logic.
- [ ] **Phase 14:** Security & production review.

---

## Phase 1 Tasks

- [x] Root README, `.gitignore`, npm workspaces
- [x] Backend: Express TS, `/api/health`, folder skeleton
- [x] Frontend: Vite React TS, Tailwind with Stitch tokens, router placeholders
- [x] Design reference copy under `docs/design-references/`
- [x] Verify `npm run build` (both packages)
