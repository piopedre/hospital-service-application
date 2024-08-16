const mongoose = require("mongoose");

const drugtherapyProblemsSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Patient",
    },
    drugTherapyProblem: {
      type: String,
      required: true,
    },
    intervention: {
      type: String,
      required: true,
    },
    outcome: {
      type: String,
      required: true,
    },
    pharmacist: {
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

const DrugTherapyProblem = mongoose.model(
  "DrugTherapyProblem",
  drugtherapyProblemsSchema
);
module.exports = DrugTherapyProblem;
