# SellPilot AI 🚀

**One Product. One Upload. Every Marketplace.**

Full-stack SaaS that automates multi-platform marketplace selling. Upload a product once and AI generates optimized listings for Facebook Marketplace, Facebook Groups (contractor / homeowner / Turkish community / fast-sale), Craigslist, eBay, OfferUp, Instagram, and TikTok — plus DM reply templates, follow-up sequences, pricing strategy, and banner/image ideas. Manage everything (review, edit, schedule, publish, leads, analytics) from one dashboard.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript + Vite + Tailwind CSS v3 |
| UI | shadcn-style components, Recharts, Framer Motion, Lucide, date-fns |
| Backend | Node.js + Express |
| AI | OpenAI GPT-4o (native fetch) with built-in template fallback |
| Database | SQLite via better-sqlite3 |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Uploads | multer → local `/uploads` |

## Quick start

```bash
# Backend
cd backend
npm install
cp .env.example .env        # add your OPENAI_API_KEY + JWT_SECRET
node server.js              # http://localhost:3001

# Frontend (second terminal)
cd frontend
npm install
npm run dev                 # http://localhost:5173 (proxies /api + /uploads to :3001)
```

Register an account, add a product with photos, then hit **Generate Listings** — the 4-step wizard takes it from there.

> **No AI key?** The app still works end-to-end: `/api/ai/generate` falls back to a deterministic local copywriter. Set `ANTHROPIC_API_KEY` (Claude) or `OPENAI_API_KEY` (GPT-4o) for real AI generation.

## Production deployment (live setup)

- **Frontend — Vercel**: the root `vercel.json` builds `frontend/` and serves it as an SPA. Production builds talk to the Supabase Edge Function backend automatically (override with `VITE_API_URL`).
- **Backend — Supabase Edge Function**: `supabase/functions/api/index.ts` is the same API ported to Deno, using Postgres and Supabase Storage (bucket `product-images`) instead of SQLite and local disk. Deploy with `supabase functions deploy api`. App JWTs are sent in the `x-sp-token` header because the platform gateway reserves `Authorization` for the Supabase anon key.
- **AI**: set the `ANTHROPIC_API_KEY` secret on the Edge Function (Dashboard → Edge Functions → Secrets) to enable Claude generation; `OPENAI_API_KEY` also works. Without either, the template fallback is used.
- The Express backend in `backend/` remains the local-dev server (`node server.js` + Vite proxy).

## Backend API

| Area | Routes |
|---|---|
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET/PUT /api/auth/me` |
| Products | `GET/POST /api/products`, `GET/PUT/DELETE /api/products/:id` (multipart images) |
| AI | `POST /api/ai/generate` `{productId}` → 12 platform listings + pricing + banner/image ideas |
| Listings | `GET /api/listings?platform=&status=`, `POST`, `PUT/DELETE /:id` |
| Leads | `GET/POST /api/leads`, `PUT/DELETE /api/leads/:id` |
| Schedule | `GET/POST /api/schedule`, `PUT /api/schedule/:id` (reschedule/cancel) |
| Credentials | `GET/POST /api/credentials`, `POST /:id/test`, `DELETE /:id` (secrets masked in responses) |
| Analytics | `GET /api/analytics?days=30` — totals, revenue series, platform performance, funnel, top products |

All routes except auth require `Authorization: Bearer <jwt>`.

## Frontend pages

`/` landing · `/login` · `/register` · `/dashboard` · `/products` · `/wizard[/:productId]` (4-step AI wizard) · `/listings` · `/calendar` (month/week) · `/leads` (kanban CRM + detail drawer) · `/analytics` · `/settings` (7 tabs: account, marketplace credentials, notifications, preferences, billing, team, API).

Dark-mode-first design (`sp-*` palette), responsive: icon-only sidebar on tablet, hamburger drawer on mobile.

## Environment variables (`backend/.env`)

```
PORT=3001
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4o
JWT_SECRET=your-super-secret-jwt-key
DATABASE_PATH=./sellpilot.db
UPLOAD_DIR=./uploads
```
