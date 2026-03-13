const Transaction = require("../models/Transaction");
const User = require("../models/User");

// @desc    Deposit virtual funds
// @route   POST /api/transactions/deposit
// @access  Private
const deposit = async (req, res) => {
  try {
    const { amount, paymentMode } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ success: false, message: "Invalid amount" });

    const user = await User.findById(req.user._id);
    user.balance = parseFloat((user.balance + parseFloat(amount)).toFixed(2));
    await user.save();

    const transaction = await Transaction.create({
      userId: user._id,
      type: "Deposit",
      amount: parseFloat(amount),
      paymentMode: paymentMode || "Net Banking",
      status: "Completed",
    });

    res.status(201).json({
      success: true,
      message: `$${amount} deposited successfully`,
      data: { transaction, newBalance: user.balance },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Withdraw virtual funds
// @route   POST /api/transactions/withdraw
// @access  Private
const withdraw = async (req, res) => {
  try {
    const { amount, paymentMode } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ success: false, message: "Invalid amount" });

    const user = await User.findById(req.user._id);
    if (user.balance < amount) {
      return res.status(400).json({ success: false, message: "Insufficient balance" });
    }

    user.balance = parseFloat((user.balance - parseFloat(amount)).toFixed(2));
    await user.save();

    const transaction = await Transaction.create({
      userId: user._id,
      type: "Withdraw",
      amount: parseFloat(amount),
      paymentMode: paymentMode || "IMPS",
      status: "Completed",
    });

    res.status(201).json({
      success: true,
      message: `$${amount} withdrawn successfully`,
      data: { transaction, newBalance: user.balance },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's transaction history
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: transactions.length, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { deposit, withdraw, getTransactions };
