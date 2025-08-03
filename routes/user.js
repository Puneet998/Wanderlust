const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const nodemailer = require("nodemailer");

const { saveRedirectUrl } = require("../middleware.js");
const userController=require("../controller/users.js")

///for signup process
router
.route("/signup")
.get(userController.renderSignupForm)///ye form per le jaayega for signup new user
.post(wrapAsync(userController.signup));//yeh route signup form se data ko le kar user ko create karega

///for login process
router.route("/login")//user ko login karwane ke liye
.get(userController.renderLoginForm) // ye login ke liye login form ko open karega
.post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login", //agar login fail hota hai to yahan redirect karega
    failureFlash: true,
  }),
  userController.login
);

//yeh route logout karne ke liye hai
router.get("/logout", userController.logout);

module.exports = router;
