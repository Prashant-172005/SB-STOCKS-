// orderRoutes.js
const express = require("express");
const router = express.Router();
const { buyStock, sellStock, getOrderHistory } = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

router.post("/buy",     protect, buyStock);
router.post("/sell",    protect, sellStock);
router.get("/history",  protect, getOrderHistory);

module.exports = router;
