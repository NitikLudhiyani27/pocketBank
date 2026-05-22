# Deploying Mayank Fashion

You have **3 ways** to see your website live. Pick whichever is easiest for you.

---

## Option A — Run on YOUR computer with Docker (easiest, no signups)

**Requirements:** Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) (free, one-click install on Windows/Mac).

That's the only thing you need. Then:

```bash
git clone https://github.com/NitikLudhiyani27/pocketBank.git
cd pocketBank
git checkout feat/mayank-fashion-ecommerce
cd mayank-fashion
docker compose up --build
```

Wait ~2 minutes for everything to start. Then open:

> **http://localhost:5173**

The seeder runs automatically and creates the admin (`admin@mayankfashion.com` / `admin123`) and 34 products.

To stop: press `Ctrl+C`. To start again later: `docker compose up`.

---

## Option B — Deploy to the internet (free, ~15 min, public URL you can share)

You'll create 3 free accounts (all sign-in with GitHub):

### 1. Database — MongoDB Atlas (free tier)

- Sign up: https://www.mongodb.com/cloud/atlas/register
- Create a free **M0** cluster (the free one)
- Database Access → Add New Database User → username/password
- Network Access → Add IP → "Allow Access from Anywhere" (`0.0.0.0/0`)
- Connect → Drivers → copy the connection string. Looks like:
  ```
  mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/mayank_fashion
  ```

### 2. Backend — Render (free tier)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/NitikLudhiyani27/pocketBank)

Or manually:
1. Sign up: https://render.com (with GitHub)
2. New → **Blueprint** → connect this repo → it reads `mayank-fashion/render.yaml` automatically
3. Render asks for the secrets:
   - `MONGO_URI` → paste your Atlas connection string
   - `CLIENT_URL` → `*` for now (we'll fix after frontend deploy)
4. Click **Apply** → wait ~3 min until status is **Live**
5. Note your backend URL, e.g. `https://mayank-fashion-api.onrender.com`

**Seed the database (one-time):** In Render dashboard → your service → Shell → run:
```bash
npm run seed
```

### 3. Frontend — Vercel (free tier)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/NitikLudhiyani27/pocketBank&root-directory=mayank-fashion/frontend&env=VITE_API_URL&envDescription=Your%20Render%20backend%20URL%20%2B%20%2Fapi)

Or manually:
1. Sign up: https://vercel.com (with GitHub)
2. **Add New Project** → import `pocketBank` repo
3. **Root Directory** → click Edit → set to `mayank-fashion/frontend`
4. **Environment Variables** → add:
   - Name: `VITE_API_URL`
   - Value: `https://mayank-fashion-api.onrender.com/api` (your Render URL + `/api`)
5. Click **Deploy** → ~2 min later you get a URL like `https://mayank-fashion.vercel.app`

### 4. Final step — point backend to frontend

Go back to Render → your service → Environment → update `CLIENT_URL` to your Vercel URL. Save (it auto-redeploys).

**That's your live website! 🎉** Share the Vercel URL with anyone.

---

## Option C — Run locally without Docker (if you already have Node + MongoDB)

```bash
cd mayank-fashion/backend && npm install && cp .env.example .env
# edit .env: set MONGO_URI to mongodb://127.0.0.1:27017/mayank_fashion
npm run seed && npm run dev
```

In another terminal:
```bash
cd mayank-fashion/frontend && npm install && npm run dev
```

Open http://localhost:5173

---

## Demo Logins (created by seed)

- **Admin:** `admin@mayankfashion.com` / `admin123`
- **Customer:** `demo@mayankfashion.com` / `demo123`

## Coupon codes
`WELCOME10` · `FLAT200` · `MAYANK20`

---

## Free-tier notes

- **Render free tier** sleeps after 15 min of inactivity. First request after sleep takes ~30s to wake up. Upgrade to $7/mo for always-on.
- **Vercel** is always-on and fast.
- **MongoDB Atlas free** has 512MB storage — plenty for getting started.
