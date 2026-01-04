const Listing=require("../models/listing");

//for index route
module.exports.index=async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
  };

//for new route
module.exports.renderNewForm=(req, res) => {
  res.render("listings/new.ejs");
};

//for show route
module.exports.showListing=async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({ 
        path: "reviews", 
        populate: { 
          path: "author"
         },
       })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist");
      return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
  }

//for create new listing

module.exports.createListing=async (req, res, next) => {
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; //owner ko current user ka id set karenge
    newListing.image.url=url;
    newListing.image.filename=filename;
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
  }

//form for edit data
module.exports.renderEditForm=async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist");
      res.redirect("/listings");
    } 

    let originalImageUrl = listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
    
    res.render("listings/edit.ejs", { listing,originalImageUrl });
    
  }

//for update route

module.exports.updateListing=async (req, res) => {
    const { id } = req.params;
    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    
    if(typeof  req.file !== "undefined"){// agra koi file ipload hui hai tabhi ye chalega 
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  }

//for delete listing
module.exports.destroyListing=async (req, res) => {
    const { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  }

