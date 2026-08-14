# Free hosting on Render

## Your website URL

**https://mandi-prices-web.onrender.com**

(API: https://mandi-prices-api.onrender.com)

---

## If you see "Not Found" — redeploy both services

The fix is on GitHub. You must redeploy on Render:

### Step 1 — Redeploy API
1. [Render Dashboard](https://dashboard.render.com) → **mandi-prices-api**
2. **Settings** → check:
   - Root Directory: `backend`
   - Build: `pip install -r requirements.txt`
   - Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
3. **Manual Deploy** → **Deploy latest commit**
4. Wait until **Live**. Test: https://mandi-prices-api.onrender.com/health

### Step 2 — Redeploy website
1. **mandi-prices-web** → **Settings** → check:
   - Root Directory: `frontend`
   - Build: `npm ci && npm run build:render`
   - Publish Directory: `./dist`
2. **Redirects/Rewrites** tab → add if missing:
   - Source: `/*` → Destination: `/index.html` → **Rewrite**
3. **Manual Deploy** → **Deploy latest commit**
4. Open: **https://mandi-prices-web.onrender.com**

> First load after idle: 30–60 seconds.

---

## Sync Blueprint from GitHub (if settings are wrong)

Render → **Blueprints** → your blueprint → **Manual Sync**  
Or delete both services and redeploy:

https://render.com/deploy?repo=https://github.com/tusharphalke19995/Today-s-Mandi-Prices
