require('dotenv').config({ quiet: true });
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel")
const router = express.Router();
const passport = require("passport");

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session:false,
    failureRedirect: "http://localhost:5173/dashboard",
  }), async (req, res) => {
    const profile = req.user;
    //user is already exist or not
    let user = await User.findOne({ email: profile.emails[0].value });
    if (user) {
      if (!user.googleId) {
        user.googleId = profile.id;
        await user.save();
      }
    } else {
      user = new User({
        username: profile.displayName,
        googleId: profile.id,
        email: profile.emails[0].value
      });
    await user.save();
    }


    const token = jwt.sign({_id:user._id,username:user.username,role:user.role}, process.env.JWT_SECRET,
    { expiresIn: "3h" })
    res.json(token);
  }
);

module.exports = router;
