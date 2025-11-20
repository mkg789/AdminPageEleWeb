const mongoose = require("mongoose");

const AdminUserSchema = new mongoose.Schema({
  username: String,
  password: String
});

// IMPORTANT: force the exact collection name from MongoDB Atlas
module.exports = mongoose.model("AdminUser", AdminUserSchema, "adminUsers");