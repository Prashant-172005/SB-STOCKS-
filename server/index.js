const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config({ path: "../.env" });

const app = express();

// ── Middleware ─────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ─────────────────────────────────────────────────
app.use("/api/auth",         require("./routes/authRoutes"));
app.use("/api/users",        require("./routes/userRoutes"));
app.use("/api/stocks",       require("./routes/stockRoutes"));
app.use("/api/orders",       require("./routes/orderRoutes"));
app.use("/api/portfolio",    require("./routes/portfolioRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api/admin",        require("./routes/adminRoutes"));

// ── Health check ────────────────────────────────────────────
app.get("/api/health", (req, res) => res.json({ status: "OK", message: "SB-Stocks API running" }));

// ── 404 handler ─────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ success: false, message: "Route not found" }));

// ── Global error handler ────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || "Server Error" });
});

// ── MongoDB + Server Start ──────────────────────────────────
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/sb-stocks";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
