const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  title: { type: String, required: true, maxLength: 100 },
  description: { type: String, required: true, minLength: 50 },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  price: { type: Number, min: 0, required: true },
  stock: { type: Number, min: 0, required: true },
  images: { type: [String], required: true },
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      rating: { type: Number, required: true, min: 0 },
      comment: { type: String }
    }
  ]
})
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
