# Render Setup — Fix "Not Found" on /health

Your screenshot shows a **Werkzeug/Flask 404** — that means Render is **NOT running our FastAPI app**.
The old service config is wrong. You must **delete and recreate** it.

---

## PART A — Delete broken services (2 min)

1. Open https://dashboard.render.com
2. Delete **mandi-prices-web** (if exists) → Settings → Delete
3. Delete **mandi-prices-api** → Settings → Delete Web Service
4. Confirm both are gone

---

## PART B — Create new API service (5 min)

1. Click **New +** → **Web Service**
2. Connect GitHub → select **Today-s-Mandi-Prices**
3. Fill EXACTLY:

| Field | Value |
|-------|-------|
| **Name** | `mandi-prices-api` |
| **Region** | Singapore |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | **Python 3** (NOT Docker, NOT Static) |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| **Plan** | Free |

4. Click **Advanced** → add Environment Variables:

| Key | Value |
|-----|-------|
| `PYTHON_VERSION` | `3.12.0` |
| `DEBUG` | `false` |
| `DATABASE_URL` | `sqlite:///./mandi_prices.db` |
| `SYNC_ENABLED` | `true` |

5. Click **Create Web Service**
6. Wait 5–8 minutes until status = **Live**

---

## PART C — Test API (must pass before website)

Open in browser:

### https://mandi-prices-api.onrender.com/health

**✅ CORRECT** (JSON):
```json
{"status":"healthy","app":"Today's Mandi Prices API","database":"connected",...}
```

**❌ WRONG** (HTML "Not Found"):
- Service still broken → check **Logs** tab on Render
- Copy error and share

Also test: https://mandi-prices-api.onrender.com/docs (Swagger UI)

---

## PART D — Deploy website on Vercel (5 min)

After /health works:

1. https://vercel.com/new
2. Import **Today-s-Mandi-Prices** from GitHub
3. Settings:

| Field | Value |
|-------|-------|
| Root Directory | `frontend` |
| Framework | Vite |

4. Environment Variable:

| Key | Value |
|-----|-------|
| `VITE_API_BASE_URL` | `https://mandi-prices-api.onrender.com/api/v1` |

5. **Deploy**
6. Your live website: `https://xxxx.vercel.app`

---

## Common mistakes

| Mistake | Fix |
|---------|-----|
| Runtime = Docker or Static | Use **Python 3** |
| Root Directory empty | Must be `backend` |
| Start Command uses port 8000 | Must use `$PORT` |
| Old service not deleted | Delete and recreate |
| /health shows HTML Not Found | Wrong app running — redo Part A+B |

---

## Final URLs

```
API health:  https://mandi-prices-api.onrender.com/health
API docs:    https://mandi-prices-api.onrender.com/docs
Website:     https://YOUR-APP.vercel.app  (from Part D)
```

Share the **Vercel URL** with farmers.
