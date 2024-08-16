const mongoose = require("mongoose");
const ProductLog = require("./ProductLog");

const productSchema = new mongoose.Schema(
  {
    productCategory: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "ProductCategory",
    },
    name: {
      type: String,
      uppercase: true,
      trim: true,
      required: true,
    },
    costPrice: {
      type: Number,
      required: true,
    },
    unitCostPrice: {
      type: Number,
    },
    sellingPrice: {
      type: Number,
    },
    fgPrice: {
      type: Number,
      default: 0,
    },
    nhiaPrice: {
      type: Number,
    },
    nnpcPrice: {
      type: Number,
    },
    quantity: {
      type: Number,
      required: true,
    },
    packSize: {
      type: Number,
      required: true,
      min: 1,
    },
    minimumQuantity: {
      type: Number,
    },
    markUp: {
      type: Number,
      default: 1.25,
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
    expiries: [
      {
        name: {
          type: String,
        },
        quantity: {
          type: Number,
        },
        expiryDate: {
          type: Date,
        },
        totalPrice: {
          type: Number,
        },
        packSize: {
          type: Number,
        },
        date: {
          type: Date,
        },
      },
    ],
    expiryDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre("save", async function (next) {
  const product = this;
  if (product.isModified("costPrice") || product.isModified("packSize")) {
    product.unitCostPrice = (product.costPrice / product.packSize).toFixed(2);
    const sellingPrice = (product.unitCostPrice * product.markUp).toFixed(2);
    product.sellingPrice = sellingPrice;
    product.nnpcPrice = (sellingPrice * 1.2).toFixed(2);
    const tenPercent = (0.1 * product.fgPrice).toFixed(2);
    if (product.fgPrice === 0) {
      product.nhiaPrice = sellingPrice;
    } else if (sellingPrice > +product.fgPrice) {
      const deficit = sellingPrice - product.fgPrice;
      product.nhiaPrice = (deficit + +tenPercent).toFixed(2);
    } else {
      product.nhiaPrice = tenPercent;
    }
  }
  if (product.isModified("fgPrice")) {
    const sellingPrice = (+product.unitCostPrice * product.markUp).toFixed(2);
    const tenPercent = (0.1 * product.fgPrice).toFixed(2);
    if (product.fgPrice === 0) {
      product.nhiaPrice = sellingPrice;
    } else if (sellingPrice > +product.fgPrice) {
      const deficit = sellingPrice - product.fgPrice;
      product.nhiaPrice = (deficit + +tenPercent).toFixed(2);
    } else {
      product.nhiaPrice = tenPercent;
    }
  }

  next();
});
productSchema.pre("remove", async function (next) {
  const product = this;
  await ProductLog.deleteMany({ product: product._id });
  next();
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
