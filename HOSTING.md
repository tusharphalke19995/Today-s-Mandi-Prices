# Hosting — Today's Mandi Prices

## Your live URL (use this only)

### https://mandi-prices-api.onrender.com

Website + API + filters + live prices — all on this one URL.

---

## mandi-prices-web NOT working?

**Delete it.** The old `mandi-prices-web` service is broken (Static Site).

1. Render Dashboard → **mandi-prices-web** → Settings → **Delete**
2. Use **mandi-prices-api** only (see above)

---

## Fix deploy (5 minutes)

### Step 1 — Update mandi-prices-api to Docker

1. [Render Dashboard](https://dashboard.render.com) → **mandi-prices-api**
2. **Settings** → **Build & Deploy**:
   - **Runtime**: change to **Docker**
   - **Dockerfile Path**: `./Dockerfile`
   - **Docker Context**: `.` (repo root)
3. **Save**

### Step 2 — Redeploy

1. **Manual Deploy** → **Deploy latest commit**
2. Wait **10–15 minutes** (Docker builds frontend + backend)
3. Open: **https://mandi-prices-api.onrender.com**

### Step 3 — Test

| URL | Expected |
|-----|----------|
| https://mandi-prices-api.onrender.com | Dashboard with mandi prices |
| https://mandi-prices-api.onrender.com/health | `{"status":"healthy",...}` |
| https://mandi-prices-api.onrender.com/docs | API documentation |

> First visit after idle: wait **30–60 seconds** (free tier waking up).

---

## Fresh deploy (if stuck)

1. Delete both old services on Render
2. Open: https://render.com/deploy?repo=https://github.com/tusharphalke19995/Today-s-Mandi-Prices
3. Click **Apply** → creates **mandi-prices-api** (Docker)
4. URL: **https://mandi-prices-api.onrender.com**

---

## Keep live prices updating (free)

**UptimeRobot** — ping every 5 min:
```
https://mandi-prices-api.onrender.com/health
```

**cron-job.org** — sync every hour:
```
POST https://mandi-prices-api.onrender.com/api/v1/sync/run
Header: X-Sync-Key: (from Render → Environment → SYNC_API_KEY)
```
