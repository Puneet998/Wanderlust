const express=require("express");
const router=express.Router({mergeParams:true});

// //wrapAsync k require karenge
const wrapAsync = require("../utils/wrapAsync.js");
// //ExpreeError ko require karenge
const ExpressError = require("../utils/ExpressError.js");

const Listing = require("../models/listing.js");

// review ke liye mongoose schema ko require kiya gaya
const Review = require("../models/review.js");

const {isLoggedIn,validateReview,isReviewAuthor} = require("../middleware.js"); //middleware.js ko require kiya gaya hai

// // function schema validation joi schema --reviewSchema--

//cotroller for review ko require kiya gaya hai
const reviewController=require("../controller/reviews.js")

// ///review ke liye route banayenge
// ///post route

//creat review
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

//Delete route of review ismain jab ham review delete karenge to vo automtic listing ke andar se bhi delete ho jaayege
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,//ye middlware hai jo check karega kaon isse delete kar raha hai
  wrapAsync(reviewController.destroyReview)
);


 module.exports=router;