const User = require("../models/User");
const Order = require("../models/Order");
const Transaction = require("../models/Transaction");
const Portfolio = require("../models/Portfolio");

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("userId", "username email").sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all transactions
// @route   GET /api/admin/transactions
// @access  Admin
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate("userId", "username email").sort({ createdAt: -1 });
    res.json({ success: true, count: transactions.length, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get platform dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
const getStats = async (req, res) => {
  try {
    const [totalUsers, totalOrders, totalTransactions, totalBuys, totalSells] = await Promise.all([
      User.countDocuments({ role: "user" }),
      Order.countDocuments(),
      Transaction.countDocuments(),
      Order.countDocuments({ orderType: "buy" }),
      Order.countDocuments({ orderType: "sell" }),
    ]);

    const volumeResult = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const totalVolume = volumeResult[0]?.total || 0;

    res.json({
      success: true,
      data: { totalUsers, totalOrders, totalTransactions, totalBuys, totalSells, totalVolume },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.role === "admin") return res.status(403).json({ success: false, message: "Cannot delete admin" });

    await User.deleteOne({ _id: req.params.id });
    await Order.deleteMany({ userId: req.params.id });
    await Transaction.deleteMany({ userId: req.params.id });
    await Portfolio.deleteMany({ userId: req.params.id });

    res.json({ success: true, message: "User and associated data deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllUsers, getAllOrders, getAllTransactions, getStats, deleteUser };
