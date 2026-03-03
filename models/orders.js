const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  user: mongoose.Schema.Types.ObjectId, ref: "User", required: true,
  
})
module.exports = Order
