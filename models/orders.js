const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true, min: 1, default: 1 },
      title: { type: String, required: true },
      price: { type: Number, required: true },
      image: { type: String, required: true },
    },
  ],
  totalProducts: { type: Number, required: true, default: 0 },
  totalPrice: { type: Number, required: true, default: 0 },
  shippingAddress: { type: String, required: true },
  paymentId: { type: String, required: true },
  paymentStatus: { type: String, required: true },
  orderStatus: { type: String, enum: ['pending', 'proccessing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now() },
  deliveredAt: { type: Date }
});
const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
