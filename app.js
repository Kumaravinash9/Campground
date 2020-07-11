/*======================================
            DEFINATION
  ======================================*/

var express           = require("express"),
    bodyParser        = require("body-parser"),
    mongoose          = require("mongoose"),
    User              = require("./models/User"),
    comment           = require("./models/comment"),
    Campground        = require("./models/Campground"),
    cat               = require("cat-me"),
    flash             = require("connect-flash"),
    methodeOverride   = require("method-override"),
    passport          = require("passport"),
    passportLocal     = require("passport-local"),
    passportLocalMong = require("passport-local-mongoose"),
    expressSession    = require("express-session"),
    CampgroundRoutes  = require("./Routes/campground"),
    commentRoutes     = require("./Routes/comment"),
    UserAuth          = require("./Routes/auth"),
    app               = express();
   

/*========================================
         FUNCTION DEFINE
  ========================================*/

  mongoose.connect("mongodb://localhost:27017/yelp-v3",{useNewUrlParser:true});
  app.set("view engine","ejs");
  app.use(bodyParser.urlencoded({extended:true}));
  app.use(express.static("public"));
  app.use(methodeOverride("_method"));
  
  app.use(flash());
  


  
  //********* PASSPORT AUTHENTICATION *******//

  app.use(expressSession({
    secret:"RUSTY",
    resave:false,
    saveUninitialized:false
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
  passport.use(new passportLocal(User.authenticate())); 

  app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.message     = req.flash("error");
    res.locals.success     = req.flash("success");
    next();
  });


  app.use(CampgroundRoutes);
  app.use(commentRoutes);
  app.use(UserAuth);
 
  function isLoggedIn(req,res,next){
    if(req.isAuthenticated())
    return next();
    req.flash("error","oops! you have to loggin first.");
    res.redirect("/login");
    };

  //************  APP LISTEN ************/

    app.listen(3000,function(){
    console.log(cat());
    });