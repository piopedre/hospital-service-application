const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    uppercase: true,
    required: true,
    unique: true,
  },
  contact: {
    type: String,
    minLength: 11,
  },
});
const Supplier = mongoose.model("Supplier", supplierSchema);
module.exports = Supplier;
