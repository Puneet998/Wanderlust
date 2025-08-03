const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
      url:String,
      filename:String,
  },

  price: Number,
  location: String,
  country: String,
  reviews:[
    {
      type:Schema.Types.ObjectId,
      ref:'Review',
    }
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
  },

});

//jab ham listing ko delete karenge to usse related review bhi automatic delete ho jaayengi
listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
 await Review.deleteMany({_id:{$in:listing.reviews}});

  }
})


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;


