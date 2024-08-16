const mongoose = require("mongoose");

const receiptSchema = new mongoose.Schema(
  {
    receipt: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Receipt = mongoose.model("Receipt", receiptSchema);
module.exports = Receipt;
