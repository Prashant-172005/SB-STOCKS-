const Portfolio = require("../models/Portfolio");

// @desc    Get user's portfolio
// @route   GET /api/portfolio
// @access  Private
const getPortfolio = async (req, res) => {
  try {
    const holdings = await Portfolio.find({ userId: req.user._id, quantity: { $gt: 0 } });
    res.json({ success: true, count: holdings.length, data: holdings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single stock holding
// @route   GET /api/portfolio/:symbol
// @access  Private
const getHolding = async (req, res) => {
  try {
    const holding = await Portfolio.findOne({
      userId: req.user._id,
      stockSymbol: req.params.symbol.toUpperCase(),
    });
    if (!holding) return res.status(404).json({ success: false, message: "Stock not in portfolio" });
    res.json({ success: true, data: holding });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getPortfolio, getHolding };
