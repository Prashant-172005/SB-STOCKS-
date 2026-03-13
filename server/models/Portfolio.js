const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stockSymbol: {
      type: String,
      required: true,
      uppercase: true,
    },
    stockName: {
      type: String,
      required: true,
    },
    exchange: {
      type: String,
      default: "NASDAQ",
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    averageBuyPrice: {
      type: Number,
      required: true,
    },
    totalInvested: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// Compound index: one entry per user per stock
portfolioSchema.index({ userId: 1, stockSymbol: 1 }, { unique: true });

module.exports = mongoose.model("Portfolio", portfolioSchema);
