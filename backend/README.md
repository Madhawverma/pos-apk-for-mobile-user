# Shree Ganesh Optical Sehore - POS & Inventory Backend

A lightweight Express & TypeScript REST API for **Shree Ganesh Optical Sehore** POS & Inventory management.

## Setup & Run

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Start in Development Mode (Live Reload)
```bash
npm run dev
```

### 3. Build & Production Start
```bash
npm run build
npm start
```

Runs by default on `http://localhost:5000`.

---

## API Endpoints

### Health Check
- `GET /api/health`

### Products & Inventory
- `GET /api/products` (supports `?category=...&search=...`)
- `GET /api/products/:id`
- `POST /api/products` (Create product & auto barcode/code)
- `PUT /api/products/:id` (Update stock, price, etc.)
- `DELETE /api/products/:id`

### Customers & Prescriptions
- `GET /api/customers` (supports `?search=...`)
- `POST /api/customers`

### Orders & POS Billing
- `GET /api/orders`
- `GET /api/orders/:id`
- `POST /api/orders` (Creates invoice, deducts inventory stock automatically)
- `PATCH /api/orders/:id/status` (Update order status, delivery, advance/balance due)

### Dashboard
- `GET /api/dashboard/stats` (Total sales, pending orders, low stock alerts)

