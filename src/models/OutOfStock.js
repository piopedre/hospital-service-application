const mongoose = require("mongoose");

const outOfStockSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      uppercase: true,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const OutOfStock = mongoose.model("OutOfStock", outOfStockSchema);
module.exports = OutOfStock;
