const mongoose = require("mongoose");

const supplySchema = new mongoose.Schema(
  {
    srv: {
      type: String,
    },
    pharmacist: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Supplier",
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
    exchange: {
      type: Boolean,
      default: false,
    },

    products: [
      {
        name: {
          type: String,
        },
        id: {
          type: mongoose.Schema.Types.ObjectId,
        },
        quantity: {
          type: Number,
        },
        onHandQty: {
          type: Number,
        },
        costPrice: {
          type: Number,
        },
        expiryDate: {
          type: Date,
        },
        packSize: {
          type: Number,
        },
        qtyPrice: {
          type: Number,
        },
        category: {
          _id: {
            type: mongoose.Schema.Types.ObjectId,
          },
          category: {
            type: String,
          },
          createdAt: {
            type: Date,
          },
          updatedAt: {
            type: Date,
          },
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Supply = mongoose.model("Supply", supplySchema);

module.exports = Supply;
