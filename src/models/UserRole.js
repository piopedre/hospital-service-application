const mongoose = require("mongoose");

const userRoleSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    uppercase: true,
    trim: true,
  },
});

const UserRole = mongoose.model("UserRole", userRoleSchema);

module.exports = UserRole;
