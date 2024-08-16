const mongoose = require("mongoose");

const transferSchema = new mongoose.Schema(
  {
    products: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
        },
        name: {
          type: String,
        },
        onHandQuantity: {
          type: Number,
        },
        quantity: {
          type: Number,
        },
        costPrice: {
          type: Number,
        },
        unitCostPrice: {
          type: Number,
        },
        expiryDate: {
          type: Date,
        },
        packSize: {
          type: Number,
        },
        totalPrice: {
          type: Number,
        },
      },
    ],
    unit: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Unit",
    },
    finalUnit: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Unit",
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    finalLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    clinic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
      required: true,
    },
    finalClinic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
      required: true,
    },
    pharmacist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    received: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Transfer = mongoose.model("Transfer", transferSchema);

module.exports = Transfer;
