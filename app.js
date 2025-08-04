if (process.env.NODE_ENV != "production") {
  require('dotenv').config();

}


// console.log(process.env.TARGET);


// sabse pahle express.js ko require kiya gaya hai
const express = require("express");
// port number define kiya hai jis per code chalega server port
const port = 8080;
// express ko use karne ke liye ham eak app name ka variable banyenge .
const app = express();
//require Ejs-mate
const ejsMate = require("ejs-mate"); //make a layout for a webpage in only one file
//ejs-mate ko use karne ke liye app.engine method se connect karenge
app.engine("ejs", ejsMate);
//ab hamne app ko ejs-mate se connect kar diya hai
//post method ko handle karne ke liye
app.use(express.urlencoded({ extended: true }));
//require path
const path = require("path");
//ejs file ko connect karenge
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
//attach public directory for css and js
app.use(express.static(path.join(__dirname, "/public")));
//require method-override
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
//mongodb ko require kiya gaya hai for database
const mongoose = require("mongoose");
//ab hamne models folder ke andar eak listening name ke js file hai usse require karenge

//ExpreeError ko require karenge
const ExpressError = require("./utils/ExpressError.js");
// review ke liye mongoose schema ko require kiya gaya
//express router vali file ko require kiya gaya hai

const listingRouter = require("./routes/listing.js");//for listing
const reviewRouter = require("./routes/review.js");//for review
const userRouter = require("./routes/user.js");//for user

//connection of database
//hamesa mongoURL ko main function se coll karne se pahle likh jata hai

const dbUrl=process.env.ATLASDB_URL;//mongodb atlas ka url hai

main()
  .then((res) => {
    console.log("connection succesfull");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(dbUrl);
}

//authentication and authorization ke liye user.js ko require karenge
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



//require express-session
const session=require("express-session");
const MongoStore = require('connect-mongo');

const store =MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
})

store.on("error",()=>{
  console.log("ERROR in Mongo session store",store);
})

const sessionOption={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge:7 * 24 * 60 * 60 * 1000,
    httpOnly:true,
  }
};



app.use(session(sessionOption));

//connect-flash require kiya gaya hai
const flash=require("connect-flash");
const { error } = require("console");
app.use(flash());
///end connect-flash


//passport-local-mongoose ko use karne ke liye passport ko initialize karna padega
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
//yeh line user ko serialize karne ke liye use hoti hai
passport.serializeUser(User.serializeUser());
//yeh uper wali line user ko serialize karne ke liye use hoti hai
passport.deserializeUser(User.deserializeUser());
//yeh line user ko deserialize karne ke liye use hoti hai


//ye neeche wali line hamne flash message ke liye likhi hai
app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
})
//yeh line hamne flash message ke liye likhi hai








///listing js se saare route require karke use kiye ja rahe hai
app.use("/listings", listingRouter);//for isting
app.use("/listings/:id/reviews", reviewRouter);//for review
app.use("/",userRouter);//for user authentication and authorization

app.get("/",(req,res)=>{
  res.redirect("/listings")
})

//agar user koi bhi route ka naam likhe cahhe vo exite na kare to ham eak error page show karenge

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
  //   res.status(statusCode).send(message);
});

app.listen(`${port}`, () => {
  console.log(`server is start on ${port}`);
});



//     https://m41sqkvg-8080.inc1.devtunnels.ms/