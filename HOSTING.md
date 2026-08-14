# One-click free public hosting

## Fix for "Not Found" on Render

The app now runs as **one service** — website + API on the same URL.

**Use this URL (not mandi-prices-web):**

👉 **https://mandi-prices-api.onrender.com**

---

## Redeploy (after GitHub update)

1. Open [Render Dashboard](https://dashboard.render.com)
2. Open **mandi-prices-api** → **Manual Deploy** → **Deploy latest commit**
3. Wait ~10 minutes for build (installs Python + Node, builds React, copies to API)
4. Open **https://mandi-prices-api.onrender.com**

You can delete the old **mandi-prices-web** static site (optional).

---

## First-time deploy

**https://render.com/deploy?repo=https://github.com/tusharphalke19995/Today-s-Mandi-Prices**

Click **Apply** → only **mandi-prices-api** is created.

| URL | Purpose |
|-----|---------|
| `https://mandi-prices-api.onrender.com` | **Website** (share this) |
| `https://mandi-prices-api.onrender.com/api/v1/...` | API |
| `https://mandi-prices-api.onrender.com/docs` | API docs |

> First load after idle: 30–60 seconds (free tier wake-up).

Full guide: [DEPLOYMENT.md](./DEPLOYMENT.md)
