const express = require("express");
const router = express.Router();
const { searchStocks, getStockQuote, getStockChart, getTrending, getStockDetails } = require("../controllers/stockController");
const { protect } = require("../middleware/authMiddleware");

router.get("/search",         protect, searchStocks);
router.get("/trending",       protect, getTrending);
router.get("/quote/:symbol",  protect, getStockQuote);
router.get("/chart/:symbol",  protect, getStockChart);
router.get("/details/:symbol",protect, getStockDetails);

module.exports = router;
