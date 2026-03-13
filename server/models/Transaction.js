const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["Deposit", "Withdraw"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [1, "Amount must be at least $1"],
    },
    paymentMode: {
      type: String,
      enum: ["IMPS", "Net Banking", "UPI", "NEFT", "Card"],
      default: "Net Banking",
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Completed",
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
