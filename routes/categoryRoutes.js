const express = require("express");
const multer = require("multer");
const Category = require("../models/categoryModel");
const router = express.Router();

/* -------------------------------- category post requests ------------------------------- */
//* upload category icon and name with multer

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload/category");
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
router.post("/", upload.single('icon'), async (req, res) => {
  if (!req.body.name || !req.file) {
    return res.status(400).json({ message: "Name and icon are missing!!" });
  }
  const category = await Category.findOne({ name: req.body.name });
  if (category) return res.status(400).json({ message: "Name is Already exist!!" })
  const newCategory = new Category({
    name: req.body.name,
    image: req.file.filename
  });
  await newCategory.save()
  res.status(201).json(newCategory)
});

module.exports = router;
