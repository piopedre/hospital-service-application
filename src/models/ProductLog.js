const mongoose = require("mongoose");

const productLogSchema = new mongoose.Schema(
  {
    serialVoucher: {
      type: String,
    },
    movement: {
      type: String,
      required: true,
      uppercase: true,
    },
    received: {
      type: Number,
    },
    issued: {
      type: Number,
    },
    balance: {
      type: Number,
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    signature: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Location",
    },
    unit: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Unit",
    },
    clinic: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Unit",
    },
  },
  {
    timestamps: true,
  }
);
const ProductLog = mongoose.model("ProductLog", productLogSchema);
module.exports = ProductLog;
