const express = require("express");
const router = express.Router();
const { getPortfolio, getHolding } = require("../controllers/portfolioController");
const { protect } = require("../middleware/authMiddleware");

router.get("/",          protect, getPortfolio);
router.get("/:symbol",   protect, getHolding);

module.exports = router;
