const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
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
    orderType: {
      type: String,
      enum: ["buy", "sell"],
      required: true,
    },
    productType: {
      type: String,
      enum: ["Intraday", "Delivery"],
      default: "Intraday",
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
    },
    pricePerShare: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed", "Cancelled"],
      default: "Completed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
