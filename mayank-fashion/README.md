# Mayank Fashion — Premium Women's E-Commerce

A modern, full-stack e-commerce platform for premium women's clothing. Built with React, Node.js, Express, MongoDB, and Tailwind CSS.

![Tech](https://img.shields.io/badge/stack-React%20%2B%20Node%20%2B%20MongoDB-pink)

## Features

### Customer-facing
- **19 product categories**: T-Shirts, Tops, Jeans, Pants, Kurti, Maxi Dresses, Palazzo Sets, Co-ord Sets, Night Suits, Ethnic Wear, Hoodies, Jackets, Skirts, Sarees, Western Dresses, Party Wear, Casual Wear, Footwear, Accessories
- **Hero slider** (auto-rotating with prev/next/dots), **Flash Sale** with live countdown, **Trending**, **New Arrivals**, **Best Sellers**, **Featured** rails on the home page
- **Customer testimonials** and **Instagram-style gallery**
- **Recently Viewed** — persisted in `localStorage`, shown on Home and Product pages
- **Live search suggestions** (debounced) in the navbar — thumbnail dropdown of matching products
- **Pincode delivery checker** on the product page (with simulated metro/ROC service)
- Product browsing with **filters, sorting, search**
- Product detail page with **gallery, size/color selectors, reviews & ratings, recommendations**
- **Wishlist** & **shopping cart** persisted on the server
- **Checkout** with address, coupon codes, COD/Razorpay/mock payment
- **Order tracking** with visual progress (Placed → Confirmed → Shipped → Out for Delivery → Delivered)
- **Print invoice** from the order confirmation page (print-friendly CSS hides chrome)
- **Floating WhatsApp chat** button (global) with preset quick-reply messages
- User **signup / login**, **forgot & reset password**, **profile** management, **order history**
- Newsletter subscription
- Static info pages: **About, Contact, FAQ, Privacy Policy, Terms & Conditions, Return & Refund Policy**
- **Dark / light mode**, smooth Framer Motion animations, lazy-loaded images, skeleton loaders

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
- **Forgot/reset password** with hashed tokens (1-hour TTL); dev token surfaced in the response when SMTP is unset
- **Newsletter** subscription endpoint
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
        ├── hooks/useRecentlyViewed.js
        ├── context/   # Auth, Cart, Wishlist, Theme
        ├── components/ # Navbar, Footer, ProductCard, HeroSlider, FlashSale,
        │              # Testimonials, InstagramGallery, RecentlyViewed,
        │              # PincodeChecker, WhatsAppButton, Protected/AdminRoute
        └── pages/      # Home, Shop, Product, Cart, Wishlist, Checkout,
                       # Login, Signup, ForgotPassword, ResetPassword,
                       # About, Contact, FAQ, PrivacyPolicy, Terms, Returns,
                       # Profile, Orders, OrderConfirmation, NotFound
                       # admin/ subfolder for the admin dashboard
```

## Getting Started

### Prerequisites
- **Node.js** 18+
- **MongoDB** running locally (or a MongoDB Atlas connection string)

### 1. Install

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

# Optional SMTP (emails are skipped silently if blank;
# password-reset still works because the token is surfaced in the API response in dev)
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
- 38 products across all 19 categories (incl. Palazzo Sets and Night Suits)
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
| POST | `/api/auth/forgot-password` | – | Email a reset link (dev: token returned in response) |
| POST | `/api/auth/reset-password` | – | Body: `{ email, token, password }` |
| POST | `/api/auth/newsletter` | – | Subscribe an email |
| GET  | `/api/auth/me` | user | Current user |
| GET  | `/api/products` | – | List with filters: `q, category, minPrice, maxPrice, sort, page, limit, featured, trending` |
| GET  | `/api/products/categories` | – | All 19 categories |
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

## Routes (Frontend)

| Path | Description |
|---|---|
| `/` | Home — slider, perks, categories, trending, flash sale, new arrivals, sale banner, best sellers, featured, recently viewed, testimonials, IG gallery |
| `/shop`, `/shop/:category` | Shop with filters & sort |
| `/product/:id` | Product detail (gallery, sizes, colors, reviews, pincode checker, recommendations, recently viewed) |
| `/cart`, `/wishlist`, `/checkout`, `/order/:id` | Cart, wishlist, checkout, order confirmation (with print-invoice) |
| `/login`, `/signup`, `/forgot-password`, `/reset-password` | Auth |
| `/profile`, `/orders` | User account |
| `/about`, `/contact`, `/faq`, `/privacy`, `/terms`, `/returns` | Static info |
| `/admin/*` | Admin dashboard (overview, products, orders, customers, coupons) |

## Deployment Notes

- **Backend**: deploy to Render / Railway / Fly.io / a VPS. Set env vars from `.env`. Use MongoDB Atlas in production.
- **Frontend**: `npm run build` produces a static `dist/` folder. Deploy to Vercel, Netlify, or Cloudflare Pages.
- Set `VITE_API_URL` (frontend env) to your deployed API URL when not using the dev proxy.
- For real Razorpay payments, fill in `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`, and replace the mock verify call in `frontend/src/pages/Checkout.jsx` with the Razorpay checkout widget.
- For the WhatsApp button to point at your real number, edit `WHATSAPP_NUMBER` in `frontend/src/components/WhatsAppButton.jsx`.

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, React Router 6, Axios, Lucide Icons, Recharts, react-hot-toast
- **Backend**: Node.js, Express, Mongoose, JWT, bcryptjs, Helmet, CORS, express-rate-limit, Multer, Nodemailer, Razorpay
- **Database**: MongoDB

## License

MIT — feel free to use this as a starting point for your own store.
