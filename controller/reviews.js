const Listing=require("../models/listing.js");

const Review = require("../models/review.js");

//create Review
module.exports.createReview=async (req, res) => {
    //req.params.id se listing ka id milega jisme review add karna hai
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;//yahan per ham apne newReview ke author ka naam set karenge jo current user hai uska naam 
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created!");
    res.redirect(`/listings/${listing._id}`);
  };

//delete review
module.exports.destroyReview=async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");

    res.redirect(`/listings/${id}`);
  };