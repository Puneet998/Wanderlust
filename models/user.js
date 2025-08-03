const mongoose = require("mongoose");
const  Schema  = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema=new Schema({
     email:{
        type:String,
        required:true,
        unique:true
     }
});
//plugin ka use ham karte hai passport-local-mongoose ka
//ye plugin user schema main add karne se hamare paas username aur password ki field automatically 
userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User",userSchema);
//user.js file is used to create user schema and model for user authentication