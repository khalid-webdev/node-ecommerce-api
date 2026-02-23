const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const router = express.Router();

//adding product to cart
router.post("/:productId",authMiddleware,async(req,res)=>{
  const { quantity } = req.body;
  const productId = req.params.productId;
  const userId = req.user._id;
  if (!productId || !quantity) {
    return res.status(400).json({ message: "Missing productId or quantity" });
  }
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product Not Found!!!" });
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({
      user: userId,
      products: [],
      totalProducts: 0,
      totalCartPrice:0
    })
  }
  console.log(cart);
    const indexOfProduct=cart.products.findIndex((product) => product.productId.toString() === productId.toString());
  console.log(indexOfProduct);
  if (indexOfProduct !== -1) {
    
    cart.products[indexOfProduct].quantity += quantity;
  } else {
    cart.products.push({
      productId: productId,
      quantity: quantity,
      title: product.title,
      price: product.price,
      image: product.images[0],
    });
  }
  cart.totalProducts = cart.products.reduce((accum, curElm) => accum + curElm.quantity, 0);
  cart.totalCartPrice = cart.products.reduce((accum, elm) => accum + elm.price * elm.quantity,0);
  await cart.save();

  res.status(200).json({message:"Product Added to cart Successfully",cart:cart})
})

module.exports = router;
