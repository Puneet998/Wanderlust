const express = require("express");
const router = express.Router();
//wrapAsync k require karenge
const wrapAsync = require("../utils/wrapAsync.js");
//listing ke model ko require kiya
const Listing = require("../models/listing.js");
const { isOwner, isLoggedIn, validateListing } = require("../middleware.js"); //middleware.js ko require kiya gaya hai
//controller ko require kiya gaya hai
const listingController = require("../controller/listings.js");

//multer ko require kiya gaya for multipart data
const multer=require("multer");
//cloudConfig file ko require kiya gaya hai
const {storage}=require("../cloudConfig.js");


const upload=multer({storage});


router.route("/")
.get(wrapAsync(listingController.index))//index Route
.post(
  isLoggedIn,
  upload.single('listing[image]'),
  validateListing, 
  wrapAsync(listingController.createListing)
);//create route database main add karne ke liye



//new route(for likhne ke liye ),isLoggedIn ke liye eak middleware.js file banayi gayi hai ye eak middleware hai
router.get(
  "/new", 
  isLoggedIn, 
  listingController.renderNewForm
);

router.route("/:id")
.get(//show route
  wrapAsync(listingController.showListing)
)

.put(//database main listing ko update karne ke liye
  isLoggedIn, //ye middleware hai jo check karega ki user logged in hai ya nahi
  isOwner,
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingController.updateListing)
)
.delete(//database main listing ko delete karne ke liye
  isLoggedIn, //ye middleware hai jo check karega ki user logged in hai ya nahi
  isOwner,
  wrapAsync(listingController.destroyListing)
);

//Edit route agar haamme edit karna hai to ham eak eak data ko eak form ki value main likhnege is route se ham eak form per jaayenge
router.get(
  "/:id/edit",
  isLoggedIn, //ye middleware hai jo check karega ki user logged in hai ya nahi
  isOwner, //ye middleware hai jo check karega ki user jo listing edit kar raha
  wrapAsync(listingController.renderEditForm)
);


module.exports = router;
