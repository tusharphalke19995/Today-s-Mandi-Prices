# Custom Domain Setup

## Your domain

**Website:** https://dailymandiupdate.naliniudyogsamuh.com  
**API:** https://mandi-prices-api.onrender.com (Render)

---

## Step 1 — Vercel (website domain)

1. Open [Vercel Dashboard](https://vercel.com/dashboard) → your **Today's Mandi Prices** project
2. Go to **Settings** → **Domains**
3. Click **Add** → enter:
   ```
   dailymandiupdate.naliniudyogsamuh.com
   ```
4. Vercel shows DNS records — copy them

---

## Step 2 — DNS (domain registrar / Cloudflare)

Log in where **naliniudyogsamuh.com** is managed (GoDaddy, Hostinger, Cloudflare, etc.)

Add this record:

| Type | Name / Host | Value / Points to | TTL |
|------|-------------|-------------------|-----|
| **CNAME** | `dailymandiupdate` | `cname.vercel-dns.com` | Auto / 3600 |

> Vercel may show a different CNAME (e.g. `xxx.vercel-dns-017.com`) — use **exactly** what Vercel displays.

**Cloudflare users:** set proxy to **DNS only** (grey cloud) until SSL works, then enable orange cloud.

Wait **5–30 minutes** for DNS propagation.

---

## Step 3 — Render API (allow your domain)

1. [Render Dashboard](https://dashboard.render.com) → **mandi-prices-api**
2. **Environment** → add or update:

| Key | Value |
|-----|-------|
| `CORS_ORIGINS` | `https://dailymandiupdate.naliniudyogsamuh.com` |

3. **Save** → service will redeploy automatically

---

## Step 4 — Redeploy Vercel

After DNS is verified in Vercel (green checkmark):

1. Vercel → **Deployments** → **Redeploy** latest
2. Open: **https://dailymandiupdate.naliniudyogsamuh.com**

---

## Step 5 — Test

| URL | Expected |
|-----|----------|
| https://dailymandiupdate.naliniudyogsamuh.com | Mandi prices dashboard |
| https://mandi-prices-api.onrender.com/api/v1/ping | `{"ok":true,...}` |

---

## Optional — API on custom subdomain

If you want `api.dailymandiupdate.naliniudyogsamuh.com` instead of Render URL:

1. Render → **mandi-prices-api** → **Settings** → **Custom Domains**
2. Add: `api.dailymandiupdate.naliniudyogsamuh.com`
3. DNS: **CNAME** `api.dailymandiupdate` → value shown by Render
4. Update Vercel env:
   - `VITE_API_BASE_URL` = `https://api.dailymandiupdate.naliniudyogsamuh.com/api/v1`
5. Redeploy Vercel

---

## Share with farmers

```
https://dailymandiupdate.naliniudyogsamuh.com
```

Works on any phone browser — no app install needed.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Domain not loading | Wait 30 min for DNS; check CNAME record |
| SSL certificate pending | Wait up to 24h; use DNS-only on Cloudflare |
| Prices empty / API error | Render API sleeping — wait 1 min or uses fallback data |
| CORS error in browser | Set `CORS_ORIGINS` on Render exactly to your https domain |
