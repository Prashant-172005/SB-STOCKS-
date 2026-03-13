📈 SB Stocks — MERN Paper Trading Platform

SB Stocks is a paper trading web application built with the MERN stack (MongoDB, Express, React, Node.js).
The platform allows users to practice buying and selling US stocks using real market data, without any real financial risk.

The goal of this project is to simulate a basic trading environment where users can explore stock prices, place buy or sell orders, track their portfolio, and review transaction history.

🗂️ Project Structure

The project is divided into two main parts: the React frontend and the Node.js backend.

SB-STOCKS/
├── client/                        React frontend
│   └── src/
│       ├── components/            Reusable UI components
│       │   ├── Navbar.js
│       │   └── ProtectedRoute.js
│       ├── context/
│       │   └── AuthContext.js     Authentication state using JWT
│       ├── pages/                 Application pages
│       │   ├── LandingPage.js
│       │   ├── LoginPage.js
│       │   ├── RegisterPage.js
│       │   ├── HomePage.js
│       │   ├── ChartPage.js
│       │   ├── PortfolioPage.js
│       │   ├── HistoryPage.js
│       │   ├── ProfilePage.js
│       │   └── admin/
│       │       ├── AdminUsers.js
│       │       ├── AdminOrders.js
│       │       └── AdminTx.js
│       ├── utils/
│       │   └── api.js             Axios setup and API functions
│       └── App.js                 Main routing file
│
├── server/                        Express backend
│   ├── config/
│   │   └── db.js                  MongoDB connection setup
│   ├── models/
│   │   ├── User.js
│   │   ├── Order.js
│   │   ├── Portfolio.js
│   │   └── Transaction.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── stockController.js
│   │   ├── orderController.js
│   │   ├── portfolioController.js
│   │   ├── transactionController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── stockRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── portfolioRoutes.js
│   │   ├── transactionRoutes.js
│   │   ├── userRoutes.js
│   │   └── adminRoutes.js
│   └── index.js                   Entry point of the backend server
│
├── database/
│   ├── seed.js                    Script to create test users
│   └── SCHEMA.md                  MongoDB collection reference
│
├── .env.example
├── .gitignore
└── package.json




Technology Used

Frontend

React

React Router

Axios

Backend

Node.js

Express.js

Database

MongoDB with Mongoose

Authentication

JWT

bcryptjs

Other Tools

nodemon

concurrently
