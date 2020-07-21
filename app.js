/*======================================
            DEFINATION
  ======================================*/

const express         = require("express"),
    bodyParser        = require("body-parser"),
    mongoose          = require("mongoose"),
    User              = require("./models/User"),
    comment           = require("./models/comment"),
    Campground        = require("./models/Campground"),
    
    port              = process.env.PORT || 3000,
    flash             = require("connect-flash"),
    methodeOverride   = require("method-override"),
    passport          = require("passport"),
    passportLocal     = require("passport-local"),
    GoogleStrategy    = require("passport-google-oauth").OAuth2Strategy,
    
    cokkieParser      = require("cookie-parser"),
    CampgroundRoutes  = require("./Routes/campground"),
    commentRoutes     = require("./Routes/comment"),
    UserAuth          = require("./Routes/auth"),
    GoogleAuth        = require("./Routes/GoogleAuth"),
    
   cookiesSession     = require("cookie-session"),
    app               = express();
   

/*========================================
         FUNCTION DEFINE
  ========================================*/

 // mongoose.connect("mongodb://localhost:27017/yelp-v3",{useNewUrlParser:true});

 app.use(cokkieParser());
 mongoose.connect("mongodb+srv://avinash:Bhai@vi9@cluster0.vtitv.mongodb.net/yelpcamp?retryWrites=true&w=majority",{useNewUrlParser:true,useFindAndModify:true,useUnifiedTopology:true});
  app.set("view engine","ejs");
  app.use(bodyParser.urlencoded({extended:true}));
  app.use(express.static("public"));
  app.use(methodeOverride("_method"));
  app.use(bodyParser.json());
  app.use(flash());

  //********* PASSPORT AUTHENTICATION *******//
/*app.use(cookiesSession({
  name : 'session',
    secret: 'super-secret-key',
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 },
 
    maxAge: 1000 * 60 * 60
}));*/
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

app.use(session({
    secret: 'foo',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));
  
  app.use(passport.initialize());
  app.use(passport.session());
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
  passport.use(new passportLocal(User.authenticate())); 
  
  //************  GOOGLE AUTH  ************//

  passport.serializeUser(function(user,done){
    done(null,user.id);
})
  passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err)
        console.log(err);
        done(null,user);
    })
})

passport.use(new GoogleStrategy({
  clientID:"179375713146-4465b5ku1uum5t9o1vgi7u8uaq8jps0a.apps.googleusercontent.com",
  clientSecret: "cFmmwyFcssa4Qp2Vzp_yKS5F",
  callbackURL: "/googleAuth"
},
function(accessToken, refreshToken, profile, done) {
    
     User.findOne({ googleId: profile.id }, function (err, user) {
         if(err)
         console.log(err);
         else{
      if(user)
      { done(null, user);}
      else
      {
          User.create({
            username: profile.displayName,
             googleId: profile.id
          },function(err,user)
          {user.save();
              done(null,user);
              console.log(user);

          })}}})}));

//**************************************************//


  app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.message     = req.flash("error");
    res.locals.success     = req.flash("success");
    next();
  });
 
  app.get("/",function(req,res){
   
    res.render("campground/home");


  });

  app.use(CampgroundRoutes);
  app.use(commentRoutes);
  app.use(UserAuth);
  app.use(GoogleAuth);
 
  

  //************  APP LISTEN ************/
  
    app.listen(port, () => {
      console.log('Web server started at port 8000!');
    });
  