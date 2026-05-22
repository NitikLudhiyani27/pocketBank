# Mayank Fashion — Premium Women's E-Commerce

A modern, full-stack e-commerce platform for premium women's clothing. Built with React, Node.js, Express, MongoDB, and Tailwind CSS.

![Tech](https://img.shields.io/badge/stack-React%20%2B%20Node%20%2B%20MongoDB-pink)

## Features

### Customer-facing
- Beautiful, responsive UI with **dark/light mode** and smooth Framer Motion animations
- 17 product categories: T-Shirts, Tops, Jeans, Pants, Kurti, Maxi Dresses, Co-ord Sets, Ethnic Wear, Hoodies, Jackets, Skirts, Sarees, Western Dresses, Party Wear, Casual Wear, Footwear, Accessories
- Product browsing with **filters, sorting, search**
- Product detail page with **gallery, size/color selectors, reviews, ratings, recommendations**
- **Wishlist** & **Shopping Cart** persisted on the server
- **Checkout** with address, coupon codes, multiple payment methods
- **Order tracking** with visual progress (Placed → Confirmed → Shipped → Delivered)
- User **signup / login** (JWT auth), profile management, order history
- About & Contact pages
- SEO-friendly markup, lazy-loaded images, fast initial render

### Admin
- Dashboard overview with KPIs (revenue, orders, products, customers)
- Sales chart (last 7 days, Recharts)
- Recent orders & low-stock alerts
- Full **product CRUD** (modal editor with sizes, colors, multiple images)
- **Order management** (status updates)
- **Customer management**
- **Coupon system** (percent / flat, min order, max discount)

### Backend
- REST API on Express with MongoDB (Mongoose)
- JWT authentication, bcrypt password hashing
- Helmet, CORS, rate-limiting on auth routes
- **Razorpay** payment integration (auto-falls-back to mock when keys missing)
- **Nodemailer** email notifications (skipped silently if SMTP not configured)
- Inventory management — stock decremented on each order

## Project Structure

```
mayank-fashion/
├── backend/
│   ├── server.js
│   ├── config/db.js
│   ├── models/        # User, Product, Cart, Wishlist, Order, Review, Coupon
│   ├── controllers/   # one per resource
│   ├── routes/
│   ├── middleware/    # auth (JWT + admin), error
│   ├── utils/         # email, seed
│   └── uploads/
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── main.jsx, App.jsx, index.css
        ├── api/client.js
        ├── context/   # Auth, Cart, Wishlist, Theme
        ├── components/ # Navbar, Footer, ProductCard, Protected/Admin routes
        └── pages/      # Home, Shop, Product, Cart, Wishlist, Checkout, ...
                       # admin/ subfolder for the admin dashboard
```

## Getting Started

### Prerequisites
- **Node.js** 18+
- **MongoDB** running locally (or a MongoDB Atlas connection string)

### 1. Clone & install

```bash
cd mayank-fashion

# Backend
cd backend
npm install
cp .env.example .env       # then edit values

# Frontend
cd ../frontend
npm install
```

### 2. Configure backend `.env`

Edit `backend/.env`:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mayank_fashion
JWT_SECRET=replace_with_a_long_random_string
CLIENT_URL=http://localhost:5173

# Optional - leave blank to use mock payment
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Optional SMTP (emails are skipped silently if blank)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=

ADMIN_EMAIL=admin@mayankfashion.com
ADMIN_PASSWORD=admin123
```

### 3. Seed the database

```bash
cd backend
npm run seed
```

This creates:
- **Admin**: `admin@mayankfashion.com` / `admin123`
- **Demo user**: `demo@mayankfashion.com` / `demo123`
- 34 products across all 17 categories
- 3 coupons: `WELCOME10`, `FLAT200`, `MAYANK20`

### 4. Run the apps

In two separate terminals:

```bash
# Terminal 1 — backend
cd backend
npm run dev          # http://localhost:5000

# Terminal 2 — frontend
cd frontend
npm run dev          # http://localhost:5173
```

Visit **http://localhost:5173** and login.

## API Reference (selected)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | – | Create account |
| POST | `/api/auth/login` | – | Login, returns JWT |
| GET  | `/api/auth/me` | user | Current user |
| GET  | `/api/products` | – | List with filters: `q, category, minPrice, maxPrice, sort, page, limit, featured, trending` |
| GET  | `/api/products/:id` | – | Product details + related |
| GET  | `/api/products/:id/recommendations` | – | AI-style recs (same category, similar price) |
| POST | `/api/products` | admin | Create |
| PUT  | `/api/products/:id` | admin | Update |
| DELETE | `/api/products/:id` | admin | Delete |
| GET/POST/PUT/DELETE | `/api/cart/*` | user | Cart ops |
| GET/POST | `/api/wishlist/*` | user | Wishlist ops |
| POST | `/api/orders` | user | Place order |
| GET  | `/api/orders/me` | user | My orders |
| GET  | `/api/orders/:id` | user | Single order |
| GET  | `/api/orders` | admin | All orders |
| PATCH | `/api/orders/:id/status` | admin | Update status |
| POST | `/api/reviews` | user | Add/update review |
| POST | `/api/coupons/apply` | user | Validate & calc discount |
| POST | `/api/payment/create-order` | user | Razorpay/mock payment |
| GET  | `/api/admin/stats` | admin | KPIs + charts |

## Deployment Notes

- **Backend**: deploy to Render / Railway / Fly.io / a VPS. Set env vars from `.env`. Use MongoDB Atlas in production.
- **Frontend**: `npm run build` produces a static `dist/` folder. Deploy to Vercel, Netlify, or Cloudflare Pages.
- Set `VITE_API_URL` (frontend env) to your deployed API URL when not using the dev proxy.
- For real Razorpay payments, fill in `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`, and integrate the Razorpay checkout widget in `frontend/src/pages/Checkout.jsx` where the mock verification currently runs.

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, React Router 6, Axios, Lucide Icons, Recharts, react-hot-toast
- **Backend**: Node.js, Express, Mongoose, JWT, bcryptjs, Helmet, CORS, express-rate-limit, Multer, Nodemailer, Razorpay
- **Database**: MongoDB

## License

MIT — feel free to use this as a starting point for your own store.
