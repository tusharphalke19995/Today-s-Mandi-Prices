# Fix Render 404 — follow these steps exactly

## Why 404?

`mandi-prices-web` was a **Static Site** — the build files were never published correctly.

The fix uses a **Node Web Service** instead (runs `serve` to host the React app).

---

## Option A — Fix mandi-prices-web (keep your URL)

### 1. Delete the broken static site
1. [Render Dashboard](https://dashboard.render.com)
2. Open **mandi-prices-web**
3. **Settings** → scroll down → **Delete Web Service** → confirm

### 2. Redeploy from GitHub Blueprint
1. Go to **Blueprints** in Render (left menu)
2. Open your blueprint OR use:
   **https://render.com/deploy?repo=https://github.com/tusharphalke19995/Today-s-Mandi-Prices**
3. Click **Apply** / **Sync** — creates fresh **mandi-prices-api** + **mandi-prices-web**

### 3. Wait & test
- **mandi-prices-api** → Live → https://mandi-prices-api.onrender.com/health
- **mandi-prices-web** → Live → **https://mandi-prices-web.onrender.com**

---

## Option B — Use API URL only (works after 1 redeploy)

If you don't want to delete anything:

1. Render → **mandi-prices-api** → **Manual Deploy** → **Deploy latest commit**
2. Wait ~10 min (builds React + copies into API)
3. Open: **https://mandi-prices-api.onrender.com**

This URL serves **website + API together**.

---

## Manual settings (if not using Blueprint)

### mandi-prices-web (NEW — must be Node, not Static)

| Setting | Value |
|---------|-------|
| Type | **Web Service** (NOT Static Site) |
| Runtime | **Node** |
| Root Directory | `frontend` |
| Build Command | `npm ci && npm run build:render` |
| Start Command | `npm run start:render` |
| Node version | `20.11.0` |

### mandi-prices-api

| Setting | Value |
|---------|-------|
| Build Command | `bash scripts/render-build.sh` |
| Start Command | `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT` |

---

## Working URLs (after fix)

```
Website:  https://mandi-prices-web.onrender.com   (Option A)
       OR https://mandi-prices-api.onrender.com     (Option B)
API:      https://mandi-prices-api.onrender.com/api/v1
Health:   https://mandi-prices-api.onrender.com/health
```

First visit after idle: **30–60 seconds** (free tier wake-up).
