# Deployment (Vercel — single project)

One Vercel project serves:

| Path | Service |
|------|---------|
| `/` | React SPA (`frontend/dist`) |
| `/api/*` | Express API (`backend` via `api/index.ts`) |

Example: `https://<project>.vercel.app/api/health`

## Build (Vercel)

Configured in root `vercel.json`:

- **Install:** `npm install` (npm workspaces)
- **Build:** `npm run build -w backend && npm run build -w frontend`
- **Output:** `frontend/dist`

Local development is unchanged: `npm run dev` (separate frontend + backend processes).

## Environment variables (set in Vercel — never commit values)

### Required for API (Production)

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | Existing MongoDB connection string |
| `JWT_SECRET` | ≥16 characters; required when `NODE_ENV=production` |
| `NODE_ENV` | `production` |

### Recommended

| Variable | Description |
|----------|-------------|
| `CLIENT_URL` | Public site origin, e.g. `https://hisham-islamic-center.vercel.app`. If omitted on Vercel, defaults to `https://${VERCEL_URL}`. |
| `JWT_EXPIRES_IN` | Default `7d` |
| `AUTH_COOKIE_NAME` | Default `hisham_auth` |

### Frontend (build-time)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Use `/api` for same-origin deployment (recommended). If unset in production builds, the app defaults to `/api`. |

### Development / seed only (do not set in production)

| Variable | Description |
|----------|-------------|
| `SEED_ADMIN_EMAIL` | Seed script |
| `SEED_ADMIN_PASSWORD` | Seed script |
| `SEED_CLEAR` | Never `true` in production |

### Optional integrations (when enabled)

`SMS_API_KEY`, `WHATSAPP_API_KEY`, `MPESA_CONSUMER_KEY`, `MPESA_CONSUMER_SECRET`, `MPESA_SHORTCODE`, `MPESA_PASSKEY`

## Post-deploy checks

1. `GET /api/health` — `database: connected`
2. Login at `/login` — cookie auth on same domain
3. Dashboard and modules load MongoDB data

## Do not deploy secrets

Never commit `.env` files or paste secrets into the repository.
