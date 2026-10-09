# 🛒 Vishal Super Market — Enterprise Grocery E-Commerce & Inventory Management System

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Production%20Live-emerald?style=for-the-badge&logo=vercel)](https://consultancy-project-git-main-suhirdha24s-projects.vercel.app)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB%20Atlas-Cloud%20Connected-green?style=for-the-badge&logo=mongodb)](https://cluster0.0f2qko.mongodb.net)

---

## 🌐 Live Production Deployment Links

- **🛒 Customer Storefront (Live Website)**: [https://consultancy-project-git-main-suhirdha24s-projects.vercel.app](https://consultancy-project-git-main-suhirdha24s-projects.vercel.app)
- **⚙️ Admin Management Portal**: [https://consultancy-project-git-main-suhirdha24s-projects.vercel.app/admin](https://consultancy-project-git-main-suhirdha24s-projects.vercel.app/admin)
- **🖥️ Backend REST API Service**: [https://consultancy-project-git-main-suhirdha24s-projects.vercel.app/api](https://consultancy-project-git-main-suhirdha24s-projects.vercel.app/api)

---

## 🌟 Key Features

### Customer-Facing Storefront (`/client`)
- **Product Discovery & Search**: Filter produce, dairy, bakery, and groceries by category, search text, or price.
- **Dynamic Shopping Cart**: Real-time quantity adjustments, price calculation, discount handling, and persistent `localStorage` cart state.
- **Checkout & Orders**: Secure order placement with shipping address management, payment method selection (COD/Online), and instant invoice generation.
- **Customer Order Tracking**: Real-time delivery status updates (`PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`).
- **Responsive Slate/Emerald UI**: Built with React, Tailwind CSS, and Lucide Icons.

### Enterprise Admin Portal (`/admin`)
- **Executive Dashboard**: Key metrics for total revenue, active orders, product catalog count, and live inventory warnings.
- **Stock & Inventory Control**: SKU & Barcode generation, cost price vs retail price tracking, min/max stock reorder thresholds, and batch expiry dates.
- **Automated Stock Alerts**: Instant notifications when stock drops below threshold or approaches expiration date.
- **Supplier & Lead Time Management**: Vendor registry tracking contact details and restock lead times.
- **Barcode & SKU Lookup Tool**: Point-of-sale scanner simulation for instant item verification and price lookup.
- **Sales Analytics & PDF Reports**: Category revenue breakdown, financial summaries, and print-ready PDF export.
- **AI Demand Forecasting**: Safety stock calculation and predictive 30-day demand reorder engine.

---

## 🏗 System Architecture

```
Consultancy-Project/
├── server/               # Node.js + Express + MongoDB REST API backend
│   ├── controllers/      # Business logic & database operations
│   ├── middleware/       # JWT Auth guards & role-based authorization
│   ├── models/           # Mongoose schemas (Product, Order, Inventory, Supplier, StockAlert)
│   ├── routes/           # Versioned API routes (/api/v1/...)
│   ├── seed.js           # Database seeder with sample products & admin credentials
│   └── test.js           # Automated system integration test suite
├── client/               # Customer React + Vite Storefront UI
└── admin/                # Admin Portal React + Vite Dashboard
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local MongoDB server (`mongodb://localhost:27017/grocery_app`) or MongoDB Atlas URI

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env
npm run dev
```

#### Seed Database
```bash
node seed.js
```

#### Run Automated Test Suite
```bash
node test.js
```

### 3. Customer Storefront Setup (`/client`)
```bash
cd client
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Admin Portal Setup (`/admin`)
```bash
cd admin
npm install
npm run dev
```
Open [http://localhost:5174](http://localhost:5174) in your browser.

---

## 🛡 API Endpoints Reference (`/api/v1`)

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/v1/auth/register` | `POST` | Customer account registration |
| `/api/v1/auth/login` | `POST` | User authentication & JWT issuance |
| `/api/v1/products` | `GET` | Fetch product catalog with filtering |
| `/api/v1/products/barcode/:code` | `GET` | Barcode / SKU product lookup |
| `/api/v1/orders/place-order` | `POST` | Place customer checkout order & deduct stock |
| `/api/v1/orders` | `GET` | Retrieve customer order history |
| `/api/v1/inventory/alerts` | `GET` | Fetch active stock & expiry alerts |
| `/api/v1/inventory/adjust-stock` | `POST` | Manual inventory adjustment / purchase reorder |
| `/api/v1/suppliers` | `GET / POST` | Supplier management |
| `/api/v1/analytics/sales-summary` | `GET` | Executive sales performance metrics |
| `/api/v1/analytics/demand-forecast` | `GET` | AI demand forecasting engine |

---

## 📜 License
MIT License • Production-ready application suitable for portfolios, client demonstrations, and real business deployments.
