const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRole");
const router = express.Router();
const multer = require("multer");
const Product = require("../models/productModel");

/* -------------------------- creating new products ------------------------- */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload/products");
  },
  filename: (req, file, cb) => {
    const timeStamp = Date.now();
    const originalName = file.originalname.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9.-]/g);
    cb(null, `${timeStamp}-${originalName}`);
  }
});
const fileFilter = (req,file,cb) => {
  const allowFiles = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
  if (allowFiles.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only jpg,jpeg,png and gif are allowed!"), false)
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limit: {
    fileSize: 2 * 1024 * 1024
  }
});
router.post("/",authMiddleware,checkRole("seller"),upload.array("images"), async (req, res) => {
  const { title, description, category, price, stock } = req.body;
  const images = req.files.map((image) => image.filename);
  console.log(req.user);
  if(images.length === 0){
    return res.status(400).json({ message: "Images feild can not be empty!" });
  }
  const newProduct = new Product({
    title,
    description,
    seller: req.user._id,
    category,
    price,
    stock,
    images
  });
  res.send(newProduct);
})



module.exports = router;
