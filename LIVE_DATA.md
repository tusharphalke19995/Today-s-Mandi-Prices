# Live Mandi Data Setup

The app pulls **live prices** from **Agmarknet** via the Government of India Open Data API ([data.gov.in](https://data.gov.in)).

## How it works

1. **Frontend** calls `GET /api/v1/live-prices` on your Render API
2. **Backend** fetches today's prices from Agmarknet (data.gov.in)
3. Prices are saved to the database and shown on the dashboard
4. If the API is down, embedded fallback rates are used (orange banner)

## Step 1 — Fix Render API

Your API must return JSON from FastAPI, not HTML 404.

**Render dashboard → mandi-prices-api:**

| Setting | Value |
|---------|--------|
| Runtime | **Python 3** |
| Root Directory | `backend` |
| Build | `pip install -r requirements.txt` |
| Start | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |

**Test after deploy:**

```text
https://mandi-prices-api.onrender.com/api/v1/ping
→ {"status":"ok","message":"pong"}

https://mandi-prices-api.onrender.com/health
→ JSON with "status":"healthy"
```

If you see HTML "404 Not Found", delete the service and redeploy from [render.yaml](./render.yaml).

## Step 2 — Get a free data.gov.in API key

1. Register at [https://data.gov.in](https://data.gov.in)
2. Open **My Account** → **Generate Your New API KEY**
3. Copy the key

## Step 3 — Set environment variables on Render

| Key | Value |
|-----|--------|
| `DATA_GOV_API_KEY` | Your key from data.gov.in |
| `CORS_ORIGINS` | `https://dailymandiupdate.naliniudyogsamuh.com` |
| `SYNC_ENABLED` | `true` |

Redeploy after saving.

## Step 4 — Vercel frontend

| Key | Value |
|-----|--------|
| `VITE_API_BASE_URL` | `https://mandi-prices-api.onrender.com/api/v1` |

## Step 5 — Keep API awake (optional, free)

Use [UptimeRobot](https://uptimerobot.com) or [cron-job.org](https://cron-job.org):

- **Ping every 5 min:** `GET https://mandi-prices-api.onrender.com/api/v1/ping`
- **Sync every hour:** `POST https://mandi-prices-api.onrender.com/api/v1/sync/run`

## Live endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /api/v1/live-prices` | Fetch today's prices from Agmarknet |
| `GET /api/v1/today-prices?fresh=true` | Same, via main prices route |
| `GET /api/v1/sync/status` | Last sync time |
| `POST /api/v1/sync/run` | Manual sync |

## Dashboard indicators

| Badge | Meaning |
|-------|---------|
| **Live — Agmarknet (Govt. of India)** | Fresh data from data.gov.in |
| **Synced mandi rates** | From database (last sync) |
| **Orange banner** | Offline fallback (API unreachable) |

Tap the **refresh** icon next to the status chip to pull live data again.
