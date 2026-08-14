# Free Public Hosting Guide

Host **Today's Mandi Prices** for free using this stack:

| Part | Free service | URL you get |
|------|-------------|-------------|
| Code | [GitHub](https://github.com) | — |
| Database | [Neon](https://neon.tech) | PostgreSQL (free forever tier) |
| Backend API | [Render](https://render.com) | `https://mandi-prices-api.onrender.com` |
| Frontend | [Vercel](https://vercel.com) | `https://your-app.vercel.app` |

**Total cost: ₹0** (free tiers)

---

## Before you start

1. Create accounts (all free):
   - [GitHub](https://github.com/signup)
   - [Neon](https://neon.tech)
   - [Render](https://dashboard.render.com/register)
   - [Vercel](https://vercel.com/signup)

2. Push your project to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Today's Mandi Prices"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/mandi-prices.git
   git push -u origin main
   ```

---

## Step 1 — Free PostgreSQL (Neon)

1. Go to [console.neon.tech](https://console.neon.tech)
2. **New Project** → name: `mandi-prices` → region: **AWS Mumbai (ap-south-1)** (closest to India)
3. Open **Dashboard** → **Connection Details**
4. Copy the connection string (PostgreSQL):
   ```
   postgresql://user:password@ep-xxxx.ap-south-1.aws.neon.tech/neondb?sslmode=require
   ```
5. Save this — you need it for Render.

> Neon free tier: 0.5 GB storage, enough for mandi prices data.

---

## Step 2 — Backend on Render (Free)

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. **New +** → **Web Service**
3. Connect your **GitHub** repo
4. Settings:

   | Setting | Value |
   |---------|-------|
   | Name | `mandi-prices-api` |
   | Region | Singapore (or closest) |
   | Branch | `main` |
   | Root Directory | `backend` |
   | Runtime | Python 3 |
   | Build Command | `pip install -r requirements.txt` |
   | Start Command | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
   | Plan | **Free** |

5. **Environment Variables** (Add):

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | Neon connection string from Step 1 |
   | `DEBUG` | `false` |
   | `CORS_ORIGINS` | `https://your-app.vercel.app` (update after Step 3) |
   | `DATA_GOV_API_KEY` | Your data.gov.in key (or default from `.env.example`) |
   | `JWT_SECRET_KEY` | Any long random string |

6. Click **Create Web Service**
7. Wait 5–10 minutes for deploy
8. Test: open `https://mandi-prices-api.onrender.com/health`

   Expected:
   ```json
   {"status":"healthy","database":"connected"}
   ```

> **Note:** Render free tier sleeps after 15 min idle. First visit may take **30–60 seconds** to wake up.

---

## Step 3 — Frontend on Vercel (Free)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your **GitHub** repo
3. Settings:

   | Setting | Value |
   |---------|-------|
   | Framework Preset | Vite |
   | Root Directory | `frontend` |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |

4. **Environment Variables**:

   | Key | Value |
   |-----|-------|
   | `VITE_API_BASE_URL` | `https://mandi-prices-api.onrender.com/api/v1` |

   (Use your actual Render URL from Step 2)

5. Click **Deploy**
6. You get: `https://mandi-prices-xxx.vercel.app`

---

## Step 4 — Connect frontend ↔ backend

1. Copy your **Vercel URL** (e.g. `https://mandi-prices-xxx.vercel.app`)
2. Go to **Render** → your service → **Environment**
3. Update `CORS_ORIGINS`:
   ```
   https://mandi-prices-xxx.vercel.app
   ```
4. Render will auto-redeploy

---

## Step 5 — Test your live app

Open your Vercel URL in mobile browser:

- Dashboard loads with mandi prices
- Hindi / Marathi language switch works
- Filters work (State, District, Mandi, Crop)

API docs (public): `https://your-api.onrender.com/docs`

---

## Alternative free frontend: Cloudflare Pages

If you prefer Cloudflare:

1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create**
2. Connect GitHub → select repo
3. Build settings:
   - Root: `frontend`
   - Build: `npm run build`
   - Output: `dist`
4. Environment variable:
   - `VITE_API_BASE_URL` = your Render API URL + `/api/v1`

---

## Custom domain (optional, free)

### Vercel (frontend)
1. Buy domain (~₹500/year) OR use free subdomain
2. Vercel → Project → **Settings** → **Domains** → add domain

### Cloudflare (free DNS + SSL)
1. Add site to Cloudflare (free plan)
2. Point DNS to Vercel

---

## Hourly live price updates (every 1 hour)

The app automatically syncs mandi prices from Agmarknet **every 1 hour**.

### On Render (recommended for free tier)

Render free tier sleeps — use **cron-job.org** (free) to trigger sync:

1. Go to [cron-job.org](https://cron-job.org) → sign up free
2. **Create cron job**:
   - URL: `https://YOUR-API.onrender.com/api/v1/sync/run`
   - Method: **POST**
   - Schedule: **Every 1 hour** (`0 * * * *`)
   - If you set `SYNC_API_KEY` on Render, add header:
     - `X-Sync-Key: your-secret-key`
3. Save — this wakes the server AND fetches latest prices

### Check sync status

```
GET https://YOUR-API.onrender.com/api/v1/sync/status
```

### Render environment variables

| Key | Value |
|-----|-------|
| `SYNC_INTERVAL_SECONDS` | `3600` |
| `SYNC_ENABLED` | `true` |
| `CACHE_TTL_SECONDS` | `3600` |
| `SYNC_API_KEY` | (optional secret for cron) |

### Frontend

The website auto-refreshes prices every **1 hour** and shows:
- 🟢 **Live — updates every 1 hour**
- Last synced time

---

## Keep backend awake (optional)

Render free tier sleeps. Options:

1. **Accept cold starts** — fine for demo/small use
2. **UptimeRobot** (free) — ping `/health` every 14 min: [uptimerobot.com](https://uptimerobot.com)
3. **Upgrade Render** to paid ($7/mo) — always on

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| CORS error | Set `CORS_ORIGINS` on Render to exact Vercel URL (no trailing `/`) |
| API slow first load | Render free tier waking up — normal |
| Database error | Check Neon connection string has `?sslmode=require` |
| Empty prices | Wait for startup seed; check Render logs |
| Build fails on Vercel | Ensure Root Directory is `frontend` |

---

## Quick checklist

- [ ] Code on GitHub
- [ ] Neon database created
- [ ] Render backend deployed + `/health` works
- [ ] Vercel frontend deployed
- [ ] `VITE_API_BASE_URL` points to Render
- [ ] `CORS_ORIGINS` points to Vercel
- [ ] App works on mobile

---

## Your live URLs (fill in after deploy)

```
Frontend:  https://________________.vercel.app
Backend:   https://________________.onrender.com
API Docs:  https://________________.onrender.com/docs
Database:  Neon (console.neon.tech)
```

Share the **Frontend URL** with farmers — works on any phone browser!
