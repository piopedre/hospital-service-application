const mongoose = require("mongoose");

const pharmacovigilanceSchema = new mongoose.Schema(
  {
    form: {},
  },
  {
    timestamps: true,
  }
);

const Pharmacovigilance = mongoose.model(
  "Pharmacovigilance",
  pharmacovigilanceSchema
);
module.exports = Pharmacovigilance;
