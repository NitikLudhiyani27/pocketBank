# Deploying Mayank Fashion to the Internet

This guide walks you through getting your store fully live on the internet,
**100% free**, in about 30 minutes. No credit card required for the database;
Render and Vercel will ask for one but won't charge on the free tier.

By the end you'll have:

- A public website URL (Vercel)
- A live API (Render)
- A cloud database (MongoDB Atlas)
- An admin panel you can log into

## Architecture

```
   Browser
      ↓
[ Vercel — Frontend ]   https://your-app.vercel.app
      ↓ (HTTPS)
[ Render — Backend ]    https://your-api.onrender.com
      ↓ (TLS)
[ MongoDB Atlas ]       cluster0.xxxxx.mongodb.net
```

## What you need before starting

- A GitHub account (you already have one — `NitikLudhiyani27`)
- An email address you can verify
- A phone number (Atlas and Vercel send SMS verification)
- A debit/credit card on file for Render and Vercel — **they will not charge
  you on free tiers**, but they require a card to prevent abuse. If you don't
  have a card, see "Alternatives" at the bottom.

---

## Step 1 — MongoDB Atlas (the database) · 5 min

1. Go to <https://www.mongodb.com/cloud/atlas/register> and sign up.
2. When asked, pick **Build a Database → M0 Free**.
   - **Provider**: AWS
   - **Region**: pick the one closest to you (`Mumbai` if available)
   - **Cluster Name**: `mayank-fashion`
3. **Security → Database Access** → **Add New Database User**:
   - Username: `mayank`
   - Password: click "Autogenerate" and **save it somewhere**
   - Role: `Atlas admin` (simpler for now; you can lock down later)
4. **Security → Network Access** → **Add IP Address** → click **"Allow Access from Anywhere"**
   (this adds `0.0.0.0/0`). This is required because Render's IPs change.
5. Back to **Database → Connect → Drivers → Node.js**. Copy the connection string. It looks like:
   ```
   mongodb+srv://mayank:<password>@mayank-fashion.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with the password from step 3, and add `/mayank_fashion`
   right before the `?`. Final string:
   ```
   mongodb+srv://mayank:YOUR_PASSWORD@mayank-fashion.xxxxx.mongodb.net/mayank_fashion?retryWrites=true&w=majority
   ```
   **Save this — you'll paste it into Render in Step 2.**

---

## Step 2 — Render (the backend API) · 10 min

This repo includes a `render.yaml` blueprint, so most settings are auto-filled.

1. Go to <https://dashboard.render.com/register> and sign up with GitHub.
2. Click **New + → Blueprint**.
3. Connect the `pocketBank` repo. Render reads `mayank-fashion/render.yaml`
   automatically and shows the service it will create.
4. Render will prompt you for the secrets that aren't in the blueprint:
   - **`MONGO_URI`** → paste the connection string from Step 1
   - **`CLIENT_URL`** → leave blank for now (we'll set it after Step 3)
   - Razorpay / SMTP fields → leave blank (optional; falls back to mock)
5. Click **Apply**. Render builds and deploys — takes ~3 minutes.
6. When it's live, copy your API URL from the top of the service page. It
   looks like `https://mayank-fashion-api.onrender.com`.
7. **Verify it's working**: visit `https://mayank-fashion-api.onrender.com/api/health`
   in your browser. You should see:
   ```json
   { "status": "ok", "service": "mayank-fashion-api" }
   ```
8. **Seed the database**:
   - In Render, open your service → **Shell** tab (left sidebar)
   - Wait for the prompt to load, then run: `npm run seed`
   - You'll see "Inserted 38 products" and the admin/demo credentials.

> **Note**: Render free tier sleeps after 15 min of inactivity. The first
> request after a sleep takes ~30s to wake up. To prevent this, sign up for
> <https://uptimerobot.com> (free) and add a monitor that pings
> `/api/health` every 5 minutes.

---

## Step 3 — Vercel (the website) · 5 min

The repo includes `mayank-fashion/frontend/vercel.json` so Vercel auto-detects
the Vite build and the SPA rewrites.

1. Go to <https://vercel.com/signup> and sign up with GitHub.
2. Click **Add New → Project** → import `pocketBank`.
3. **Configure Project**:
   - **Root Directory**: click **Edit** → set to `mayank-fashion/frontend`
   - **Framework Preset**: should auto-detect as Vite
4. **Environment Variables** → add one:

   | Name | Value |
   |------|-------|
   | `VITE_API_URL` | `https://mayank-fashion-api.onrender.com/api` |

   (Use the actual URL from Step 2.7, with `/api` appended.)
5. Click **Deploy**. Wait ~2 minutes.
6. Vercel gives you a URL like `https://pocket-bank-xxx.vercel.app`. Copy it.

---

## Step 4 — Connect them · 1 min

Now tell the backend to trust your frontend.

1. Render → your `mayank-fashion-api` service → **Environment** tab
2. Edit `CLIENT_URL` and set it to your Vercel URL (no trailing slash):
   ```
   https://pocket-bank-xxx.vercel.app
   ```
3. Click **Save Changes**. Render redeploys automatically (~1 min).

---

## You're live

Open your Vercel URL and try:

- Browse products → search → filter → sort
- Add to cart → wishlist
- Login as **demo user**: `demo@mayankfashion.com` / `demo123`
- Place a checkout (use payment method "Cash on Delivery" — no real money moves)
- Login as **admin**: `admin@mayankfashion.com` / `admin123` and visit `/admin`

> ⚠ **Security**: The seeded admin password is `admin123`. As soon as everything
> works, log into the admin panel and change it (or run `npm run seed` again
> with a different `ADMIN_PASSWORD` env var on Render).

---

## Step 5 (optional) — Custom domain

Have a domain like `mayankfashion.in`?

1. Vercel → Project → **Settings → Domains** → Add Domain
2. Vercel shows you DNS records to add (usually one A record + one CNAME)
3. At your domain registrar (GoDaddy / Namecheap / Hostinger), add those records
4. Wait 5–30 minutes for DNS to propagate. Vercel auto-provisions HTTPS.
5. Go back to Render and update `CLIENT_URL` to your custom domain.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| Frontend loads but no products show | `VITE_API_URL` is wrong, or backend CORS is blocking. Check browser DevTools → Network tab. |
| API returns "CORS blocked" | `CLIENT_URL` on Render doesn't match your Vercel URL exactly. No trailing slash. |
| Login fails with 401 | Database wasn't seeded. Run `npm run seed` in Render's Shell. |
| Backend won't start | Check Render's Logs tab. 99% of the time it's a typo in `MONGO_URI`. |
| First page load is slow (~30s) | Render free tier was sleeping. Set up UptimeRobot to keep it awake. |
| Razorpay errors at checkout | Leave `RAZORPAY_KEY_ID` blank to use the built-in mock payment, or fill in real test keys from <https://razorpay.com>. |

## Alternatives if you don't have a credit card

- **Backend**: deploy on **Railway** (https://railway.app) — uses Trial credit, no card needed for first $5. Or **Cyclic** (https://cyclic.sh) — fully free, no card.
- **Frontend**: **Netlify** (https://netlify.com) and **Cloudflare Pages** (https://pages.cloudflare.com) both work without a card. Same Vite build.

The architecture is identical; only the platform changes.

## Updating the site later

Both Vercel and Render are connected to your GitHub. **Every push to `main` automatically redeploys** both services. No manual work needed.

```bash
git checkout main
# make your changes
git add . && git commit -m "update homepage" && git push
# wait ~2 min, refresh your live site
```

That's it — you now have a real, deployed e-commerce site.
