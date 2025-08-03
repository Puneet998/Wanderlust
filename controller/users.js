//for user route
const User=require("../models/user")

//new signup ke liye naya signup form
module.exports.renderSignupForm= (req, res) => {
  res.render("users/signup.ejs");
};

//creating new post
module.exports.signup=async (req, res) => {
    try {
      const { username, email, password } = req.body;
      let newUser = new User({ username, email });
      let registeredUser = await User.register(newUser, password);
      //agar user successfully register ho jaata hai to usse login karne ke liye yahan per login karwa denge
      //req.login() function ko use karke user ko login karwa denge
      req.login(registeredUser,(err)=>{
        if(err){
          return next(err);
        }
         req.flash("success", "Welcome to Wanderlust ");
         res.redirect("/listings");
      });

    } catch (err) {
      let errMsg = err.message;
      //jab email already exists hota hai to error message aata hai
      if (errMsg.includes("duplicate key error collection")) {
        errMsg = "This Email already registered ";
      }
      req.flash("error", errMsg);
      res.redirect("/signup");
    }
  };

  //login karne ke liye form per le jaayega
  module.exports.renderLoginForm = async (req, res) => {
  res.render("users/login.ejs");
}

//succesfull login karne ke baad kya karna hai ye deside karega
module.exports.login=async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    let redirectUrl=res.locals.redirectUrl || "/listings";//agar direct login page se login kiya hai ti listings page per redirect karega
    res.redirect(redirectUrl);
  };

//for logout 
module.exports.logout=(req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
};