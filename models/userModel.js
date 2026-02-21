const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, unique: true },
  password: { type: String, required: false, minLength: 6 },
  deliveryAddress: { type: String, required: false, minLength: 5 },
  googleId: { type: String, unique: true },
  role: { type: String, enum: ["user", "admin", "seller"], default: "user" }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
