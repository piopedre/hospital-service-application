const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  regDate: {
    type: Date,
  },
  admission: {
    type: Boolean,
    default: false,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  otherName: {
    type: String,
    trim: true,
    uppercase: true,
  },
  sex: {
    type: String,
    required: true,
    uppercase: true,
  },
  fileNumber: {
    type: String,
    required: true,
    unique: true,
  },
  dateOfBirth: {
    type: Date,
  },
  balance: {
    type: Number,
    default: 0,
  },
});

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;
