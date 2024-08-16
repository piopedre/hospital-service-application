const mongoose = require("mongoose");

const wardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Location",
    },
  },
  {
    timestamps: true,
  }
);

const Ward = mongoose.model("Ward", wardSchema);
module.exports = Ward;
