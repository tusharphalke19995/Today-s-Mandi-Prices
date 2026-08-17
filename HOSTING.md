# Hosting — WORKING setup (Render API + Vercel website)

## Why you see "Not Found"

Render services are **not running** or **failed to deploy**.  
The old `mandi-prices-web` URL will never work — delete it.

---

## Step 1 — Backend on Render (API)

1. [Render Dashboard](https://dashboard.render.com) → **mandi-prices-api**
   - If missing: **New +** → **Web Service** → connect GitHub repo
2. **Settings → Build & Deploy**:

| Setting | Value |
|---------|-------|
| Name | `mandi-prices-api` |
| Runtime | **Docker** |
| Dockerfile Path | `./Dockerfile` |
| Docker Context | `.` |
| Plan | Free |

3. **Manual Deploy** → wait 5–8 min
4. **Test:** https://mandi-prices-api.onrender.com/health  
   Must show: `{"status":"healthy",...}`  
   If this fails, website will not work.

---

## Step 2 — Frontend on Vercel (Website) — RECOMMENDED

Vercel is free and reliable for the React app.

1. Go to **https://vercel.com/new**
2. Import GitHub repo: **Today-s-Mandi-Prices**
3. Settings:

| Setting | Value |
|---------|-------|
| Framework | Vite |
| Root Directory | `frontend` |
| Build Command | `npm run build:render` |
| Output | `dist` |

4. Environment variable (already in `.env.production`, but add to be safe):

| Key | Value |
|-----|-------|
| `VITE_API_BASE_URL` | `https://mandi-prices-api.onrender.com/api/v1` |

5. Click **Deploy** → you get: `https://todays-mandi-prices.vercel.app` (or similar)

**Share this Vercel URL with farmers** — it always works.

---

## Your URLs

```
Website (share this):  https://YOUR-APP.vercel.app
API:                   https://mandi-prices-api.onrender.com
Health check:          https://mandi-prices-api.onrender.com/health
API docs:              https://mandi-prices-api.onrender.com/docs
```

---

## Optional — All-in-one on Render

If you want ONE URL on Render only:

1. Render → mandi-prices-api → Settings
2. Dockerfile Path: `./Dockerfile.fullstack`
3. Redeploy → use https://mandi-prices-api.onrender.com

---

## Delete broken service

Render → **mandi-prices-web** → Settings → **Delete**

---

## Keep prices live (free)

**UptimeRobot** — ping every 5 min:
```
https://mandi-prices-api.onrender.com/health
```

**cron-job.org** — hourly sync:
```
POST https://mandi-prices-api.onrender.com/api/v1/sync/run
Header: X-Sync-Key: (from Render Environment)
```
