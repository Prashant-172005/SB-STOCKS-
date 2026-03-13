import axios from "axios";

const API = axios.create({ baseURL: "/api" });

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("sbUser") || "null");
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

// ── Auth ────────────────────────────────────────────────────
export const registerUser  = (data) => API.post("/auth/register", data);
export const loginUser     = (data) => API.post("/auth/login", data);
export const getMe         = ()     => API.get("/auth/me");

// ── Stocks ──────────────────────────────────────────────────
export const searchStocks   = (query)  => API.get(`/stocks/search?query=${query}`);
export const getTrending    = ()       => API.get("/stocks/trending");
export const getStockQuote  = (symbol) => API.get(`/stocks/quote/${symbol}`);
export const getStockChart  = (symbol, params) => API.get(`/stocks/chart/${symbol}`, { params });
export const getStockDetails= (symbol) => API.get(`/stocks/details/${symbol}`);

// ── Orders ──────────────────────────────────────────────────
export const buyStock      = (data) => API.post("/orders/buy", data);
export const sellStock     = (data) => API.post("/orders/sell", data);
export const getOrderHistory = ()   => API.get("/orders/history");

// ── Portfolio ───────────────────────────────────────────────
export const getPortfolio  = ()       => API.get("/portfolio");
export const getHolding    = (symbol) => API.get(`/portfolio/${symbol}`);

// ── Transactions ────────────────────────────────────────────
export const depositFunds    = (data) => API.post("/transactions/deposit", data);
export const withdrawFunds   = (data) => API.post("/transactions/withdraw", data);
export const getTransactions = ()     => API.get("/transactions");

// ── User ────────────────────────────────────────────────────
export const getUserProfile  = ()     => API.get("/users/profile");
export const updateProfile   = (data) => API.put("/users/profile", data);

// ── Admin ───────────────────────────────────────────────────
export const adminGetStats        = ()     => API.get("/admin/stats");
export const adminGetUsers        = ()     => API.get("/admin/users");
export const adminDeleteUser      = (id)   => API.delete(`/admin/users/${id}`);
export const adminGetOrders       = ()     => API.get("/admin/orders");
export const adminGetTransactions = ()     => API.get("/admin/transactions");
