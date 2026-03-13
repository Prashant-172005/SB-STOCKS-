const Order = require("../models/Order");
const Portfolio = require("../models/Portfolio");
const User = require("../models/User");

// @desc    Place a buy order
// @route   POST /api/orders/buy
// @access  Private
const buyStock = async (req, res) => {
  try {
    const { stockSymbol, stockName, exchange, productType, quantity, pricePerShare } = req.body;

    if (!stockSymbol || !quantity || !pricePerShare) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const totalAmount = parseFloat((quantity * pricePerShare).toFixed(2));
    const user = await User.findById(req.user._id);

    // Check balance
    if (user.balance < totalAmount) {
      return res.status(400).json({ success: false, message: "Insufficient balance" });
    }

    // Deduct balance
    user.balance = parseFloat((user.balance - totalAmount).toFixed(2));
    await user.save();

    // Record order
    const order = await Order.create({
      userId: user._id,
      stockSymbol: stockSymbol.toUpperCase(),
      stockName,
      exchange: exchange || "NASDAQ",
      orderType: "buy",
      productType: productType || "Intraday",
      quantity,
      pricePerShare,
      totalAmount,
      status: "Completed",
    });

    // Update portfolio
    const existing = await Portfolio.findOne({ userId: user._id, stockSymbol: stockSymbol.toUpperCase() });

    if (existing) {
      const newQty = existing.quantity + quantity;
      const newTotalInvested = existing.totalInvested + totalAmount;
      existing.quantity = newQty;
      existing.totalInvested = parseFloat(newTotalInvested.toFixed(2));
      existing.averageBuyPrice = parseFloat((newTotalInvested / newQty).toFixed(2));
      await existing.save();
    } else {
      await Portfolio.create({
        userId: user._id,
        stockSymbol: stockSymbol.toUpperCase(),
        stockName,
        exchange: exchange || "NASDAQ",
        quantity,
        averageBuyPrice: pricePerShare,
        totalInvested: totalAmount,
      });
    }

    res.status(201).json({
      success: true,
      message: `Bought ${quantity} shares of ${stockSymbol} successfully`,
      data: { order, newBalance: user.balance },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Place a sell order
// @route   POST /api/orders/sell
// @access  Private
const sellStock = async (req, res) => {
  try {
    const { stockSymbol, stockName, exchange, productType, quantity, pricePerShare } = req.body;

    const holding = await Portfolio.findOne({ userId: req.user._id, stockSymbol: stockSymbol.toUpperCase() });

    if (!holding || holding.quantity < quantity) {
      return res.status(400).json({ success: false, message: "Insufficient shares to sell" });
    }

    const totalAmount = parseFloat((quantity * pricePerShare).toFixed(2));

    // Add proceeds to balance
    const user = await User.findById(req.user._id);
    user.balance = parseFloat((user.balance + totalAmount).toFixed(2));
    await user.save();

    // Record order
    const order = await Order.create({
      userId: user._id,
      stockSymbol: stockSymbol.toUpperCase(),
      stockName,
      exchange: exchange || "NASDAQ",
      orderType: "sell",
      productType: productType || "Intraday",
      quantity,
      pricePerShare,
      totalAmount,
      status: "Completed",
    });

    // Update portfolio
    holding.quantity -= quantity;
    holding.totalInvested = parseFloat((holding.quantity * holding.averageBuyPrice).toFixed(2));

    if (holding.quantity === 0) {
      await Portfolio.deleteOne({ _id: holding._id });
    } else {
      await holding.save();
    }

    res.json({
      success: true,
      message: `Sold ${quantity} shares of ${stockSymbol} successfully`,
      data: { order, newBalance: user.balance },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's order history
// @route   GET /api/orders/history
// @access  Private
const getOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { buyStock, sellStock, getOrderHistory };
