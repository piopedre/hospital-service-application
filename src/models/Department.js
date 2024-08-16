const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      unique: true,
    },
    units: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Unit",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Department = mongoose.model("Department", departmentSchema);
module.exports = Department;
