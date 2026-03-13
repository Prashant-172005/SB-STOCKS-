# 📈 SB Stocks — MERN Paper Trading Platform

A full-stack paper trading web application built with **MongoDB · Express · React · Node.js**.  
Practice US stock trading with real market data — zero financial risk.

---

## 🗂️ Project Structure

```
SB-STOCKS/
├── client/                        ← React Frontend
│   └── src/
│       ├── components/
│       │   ├── Navbar.js          ← Responsive nav (user + admin modes)
│       │   └── ProtectedRoute.js  ← Auth guards
│       ├── context/
│       │   └── AuthContext.js     ← JWT auth state (localStorage)
│       ├── pages/
│       │   ├── LandingPage.js     ← Public marketing page
│       │   ├── LoginPage.js       ← Sign in
│       │   ├── RegisterPage.js    ← Sign up
│       │   ├── HomePage.js        ← Watchlist + stock search
│       │   ├── ChartPage.js       ← Stock chart + buy/sell order
│       │   ├── PortfolioPage.js   ← User holdings
│       │   ├── HistoryPage.js     ← Order history
│       │   ├── ProfilePage.js     ← Balance + transactions
│       │   └── admin/
│       │       ├── AdminUsers.js  ← All users + stats
│       │       ├── AdminOrders.js ← All platform orders
│       │       └── AdminTx.js     ← All platform transactions
│       ├── utils/
│       │   └── api.js             ← Axios instance + all API calls
│       └── App.js                 ← Routes
│
├── server/                        ← Node.js + Express Backend
│   ├── config/
│   │   └── db.js                  ← MongoDB connection
│   ├── models/
│   │   ├── User.js                ← User schema + bcrypt
│   │   ├── Order.js               ← Buy/sell orders
│   │   ├── Portfolio.js           ← Holdings per user
│   │   └── Transaction.js         ← Deposit/withdraw
│   ├── controllers/
│   │   ├── authController.js      ← Register, login, getMe
│   │   ├── stockController.js     ← Polygon.io API integration
│   │   ├── orderController.js     ← Buy/sell logic + balance update
│   │   ├── portfolioController.js ← Get holdings
│   │   ├── transactionController.js ← Deposit/withdraw
│   │   └── adminController.js     ← Admin dashboard data
│   ├── middleware/
│   │   └── authMiddleware.js      ← JWT protect + adminOnly
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── stockRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── portfolioRoutes.js
│   │   ├── transactionRoutes.js
│   │   ├── userRoutes.js
│   │   └── adminRoutes.js
│   └── index.js                   ← Express app entry point
│
├── database/
│   ├── seed.js                    ← Seed admin + test users
│   └── SCHEMA.md                  ← MongoDB collection reference
│
├── .env.example                   ← Environment variable template
├── .gitignore
└── package.json                   ← Root scripts (concurrently)
```

---

## ⚡ Quick Start

### 1. Clone & Install
```bash
git clone <your-repo>
cd SB-STOCKS

# Install all dependencies at once
npm run install-all
```

### 2. Configure Environment
```bash
cp .env.example .env
```
Edit `.env`:
```
MONGO_URI=mongodb://localhost:27017/sb-stocks
JWT_SECRET=your_secret_key_here
POLYGON_API_KEY=your_polygon_api_key     ← Get free at polygon.io
CLIENT_URL=http://localhost:3000
```

### 3. Seed the Database
```bash
cd database
node seed.js
```
This creates:
| Role  | Email                  | Password  |
|-------|------------------------|-----------|
| Admin | admin@sbstocks.com     | admin123  |
| User  | alice@example.com      | alice123  |
| User  | bob@example.com        | bob12345  |

### 4. Run (Development)
```bash
# From root — starts both client + server
npm run dev
```
- Frontend: http://localhost:3000  
- Backend API: http://localhost:5000/api

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint           | Access  | Description       |
|--------|--------------------|---------|-------------------|
| POST   | /api/auth/register | Public  | Create account    |
| POST   | /api/auth/login    | Public  | Login + JWT       |
| GET    | /api/auth/me       | Private | Current user      |

### Stocks (Polygon.io)
| Method | Endpoint                     | Description            |
|--------|------------------------------|------------------------|
| GET    | /api/stocks/search?query=    | Search stocks          |
| GET    | /api/stocks/trending         | Top 7 stocks snapshot  |
| GET    | /api/stocks/quote/:symbol    | Latest price           |
| GET    | /api/stocks/chart/:symbol    | OHLC chart data        |
| GET    | /api/stocks/details/:symbol  | Company details        |

### Orders
| Method | Endpoint            | Description         |
|--------|---------------------|---------------------|
| POST   | /api/orders/buy     | Buy shares          |
| POST   | /api/orders/sell    | Sell shares         |
| GET    | /api/orders/history | User order history  |

### Portfolio
| Method | Endpoint             | Description         |
|--------|----------------------|---------------------|
| GET    | /api/portfolio       | All user holdings   |
| GET    | /api/portfolio/:sym  | Single stock holding|

### Transactions
| Method | Endpoint                      | Description           |
|--------|-------------------------------|-----------------------|
| POST   | /api/transactions/deposit     | Add virtual funds     |
| POST   | /api/transactions/withdraw    | Withdraw virtual funds|
| GET    | /api/transactions             | Transaction history   |

### Admin (Admin only)
| Method | Endpoint                  | Description         |
|--------|---------------------------|---------------------|
| GET    | /api/admin/stats          | Platform stats      |
| GET    | /api/admin/users          | All users           |
| DELETE | /api/admin/users/:id      | Delete user         |
| GET    | /api/admin/orders         | All orders          |
| GET    | /api/admin/transactions   | All transactions    |

---

## 🛡️ Features

- **JWT Authentication** — secure token-based auth stored in localStorage
- **Role-based Access** — user routes vs admin routes enforced on both frontend and backend
- **Paper Trading** — buy/sell logic with real balance deduction and portfolio updates
- **Real Market Data** — Polygon.io API for live quotes, OHLC charts, and stock search
- **Portfolio Tracking** — weighted average buy price, total invested, unrealized P&L
- **Fund Management** — deposit and withdraw virtual funds with payment mode tracking
- **Admin Dashboard** — platform-wide stats, user management, all orders & transactions

---

## 🔧 Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Frontend | React 18, React Router v6, Axios        |
| Backend  | Node.js, Express.js                     |
| Database | MongoDB, Mongoose                       |
| Auth     | JWT (jsonwebtoken), bcryptjs            |
| Charts   | Custom SVG (lightweight-charts optional)|
| API      | Polygon.io (free tier)                  |
| Toasts   | react-hot-toast                         |
| Dev      | nodemon, concurrently                   |

---

## 📝 Notes

- All users start with **$10,000 virtual balance**
- Polygon.io free tier has rate limits — the app gracefully falls back to mock data
- For production: add `process.env.NODE_ENV === 'production'` checks and use `.env` secrets manager
