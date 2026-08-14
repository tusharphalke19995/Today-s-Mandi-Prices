# Dynamic features on Render (live prices, filters, hourly sync)

## What works dynamically

| Feature | How |
|---------|-----|
| Live mandi prices | Agmarknet API sync every 1 hour |
| Mumbai / Pune / Manchar / Junnar | Priority sync + quick filter chips |
| State / District / Mandi / Crop filters | Loaded from database |
| Search | Real-time API query |
| Language switch (Hindi/Marathi/English) | Client-side |
| Price refresh | Auto every 1 hour in browser |

---

## Keep it alive on Render free tier (IMPORTANT)

Render free tier **sleeps after 15 min**. Without these, sync stops and first load is slow.

### 1. UptimeRobot — wake server every 14 min (free)

1. https://uptimerobot.com → free account
2. **Add Monitor**:
   - Type: HTTP(s)
   - URL: `https://mandi-prices-api.onrender.com/health`
   - Interval: **5 minutes** (or 14 min)

### 2. cron-job.org — hourly price sync (free)

1. https://cron-job.org → free account
2. **Create cron job**:
   - URL: `https://mandi-prices-api.onrender.com/api/v1/sync/run`
   - Method: **POST**
   - Schedule: **Every hour** (`0 * * * *`)
   - Header: `X-Sync-Key: <your SYNC_API_KEY from Render env>`

Get `SYNC_API_KEY` from Render → **mandi-prices-api** → **Environment**.

---

## Deploy checklist

- [ ] **mandi-prices-api** redeployed (latest GitHub commit)
- [ ] **mandi-prices-web** is **Node Web Service** (not Static Site)
- [ ] UptimeRobot pinging `/health`
- [ ] cron-job.org POST `/api/v1/sync/run` hourly
- [ ] Test filters, search, quick market chips
- [ ] Test commodity detail page (click a price card)

---

## Test URLs

```
Health:   https://mandi-prices-api.onrender.com/health
Sync:     https://mandi-prices-api.onrender.com/api/v1/sync/status
Prices:   https://mandi-prices-api.onrender.com/api/v1/today-prices?areas=Mumbai,Pune,Manchar,Junnar&state=Maharashtra
Website:  https://mandi-prices-web.onrender.com
          OR https://mandi-prices-api.onrender.com
```

---

## If filters show empty

1. Wait 1–2 min after first load (API waking + syncing)
2. Check sync status URL above — `last_sync_at` should update
3. Manually trigger sync: POST to `/api/v1/sync/run` with `X-Sync-Key` header
