# One-click free public hosting

## Fastest way (2 clicks, ₹0)

### Render — backend + website together

1. Open this link (log in with GitHub if asked):

   **https://render.com/deploy?repo=https://github.com/tusharphalke19995/Today-s-Mandi-Prices**

2. Click **Apply** → wait ~10 minutes for both services to deploy.

3. Your live URLs (in Render dashboard):

   | Service | URL |
   |---------|-----|
   | **Website** (share this) | `https://mandi-prices-web.onrender.com` |
   | **API** | `https://mandi-prices-api.onrender.com` |
   | **API docs** | `https://mandi-prices-api.onrender.com/docs` |

No credit card needed on free tier. Mumbai/Pune/Manchar/Junnar prices load automatically.

> First visit after idle may take 30–60 seconds (free tier wakes up).

---

## Optional: Vercel frontend (faster website)

If you want a faster frontend URL on Vercel:

1. https://vercel.com/new → import **Today-s-Mandi-Prices**
2. Root Directory: `frontend`
3. Environment variable:
   - `VITE_API_BASE_URL` = `https://mandi-prices-api.onrender.com/api/v1`
4. Deploy

---

## Optional: Neon PostgreSQL (persistent database)

Default Render setup uses SQLite (resets on redeploy; seed data reloads on startup).

For permanent storage:

1. Create free DB at https://neon.tech (Mumbai region)
2. Render → **mandi-prices-api** → Environment → set `DATABASE_URL` to Neon connection string
3. Redeploy

---

## Hourly price sync (cron-job.org)

1. https://cron-job.org → free account
2. New cron job:
   - URL: `https://mandi-prices-api.onrender.com/api/v1/sync/run`
   - Method: **POST**
   - Every 1 hour

---

Full details: [DEPLOYMENT.md](./DEPLOYMENT.md)
