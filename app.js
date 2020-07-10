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
  passport.use(new passportLocal({
    
  },User.authenticate())); 
  /**passport.use(new passportLocal({
    passReqToCallback : true,
  },
  (req,username,password,isLoggedIn)=>{
   User.findOne({
     username,function(err,user){
       if(!user){
         return isLoggedIn(null,false,req.flash("error","User is not defined!."));
       }
     
   }



  })}
  ));**/
  app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.message     = req.flash("error");
    res.locals.success     = req.flash("success");
    next();
  });


/*========================================
             ROUTES    
  =======================================*/
  
  //******  INDEX ROUTES   ******//

  app.get("/campground",function(req,res){
    Campground.find({},function(err,campground){
     if(err)
     console.log(err);
     else
     {
      
     res.render("index",{campground:campground});
    console.log(req.user);}})
    });
    
  //*******  NEW ROUTES   **********//
     
  app.get("/campground/new",isLoggedIn,function(req,res){
     res.render("campground/new");
    });

  //*******  CREATE ROUTES   *************//

  app.post("/campground",function(req,res){
       Campground.create({
           title:req.body.title,
           image:req.body.image,
           description:req.body.description,
          
        },function(err,Campground){
          if(err)
          console.log(err);
          else
        {Campground.author.username=req.user.username;
          Campground.author.id =req.user._id;
          
          Campground.save();
          res.redirect("/campground");
        }
        })
    });

  //**********  SHOW ROUTS  *************//

  app.get("/campground/:id",function(req,res){
    Campground.findById(req.params.id).populate("comment").exec(function(err,campground){
     if(err)
     console.log(err);
     else
     res.render("campground/show",{campground:campground});
    
    })
  });

//************** SHOW COMMENT ROUTES ***************//

 app.get("/campground/:id/comment/new",isLoggedIn,function(req,res){
   Campground.findById(req.params.id,function(err,campground){
     if(err)
    console.log(err);
    else
    res.render("comment/new",{campground:campground});
   })
  });

 //                       Post Route                           //

 app.post("/campground/:id/comment",function(req,res){
  Campground.findById(req.params.id).populate("comment").exec(function(err,Campground){
  if(err)
  {console.log(err);
   res.redirect("/campground");
  }
  else
  {
   var comments={};
   comments.author=req.user;
   comments.author.username=req.user.username;
   comments.text=req.body.text;
  comment.create(comments
    ,function(err,comment){
  if(err)
  console.log(err);
  else
  {Campground.comment.push(comment);
  Campground.save();
  console.log(comment);
  res.redirect("/campground/"+req.params.id);}})
  }
 })
 });

 //                Edit Route               //
 app.get("/campground/:id/comment/:comment_id/edit",function(req,res){
comment.findById(req.params.comment_id,function(err,comment){
if(err)
res.redirect("/campground/"+req.params.id);
else
{res.render("comment/show",{
  comment:comment,campgroundid:req.params.id
})

}
})
 });

 //                  UPDATE                //

app.put("/campground/:id/comment/:comment_id",function(req,res){
 comment.findByIdAndUpdate(
  req.params.comment_id,{text:req.body.text},function(err,comment){
if(err)
res.redirect("/campground");
else
res.redirect("/campground/"+req.params.id);
  }
 )

});
app.get("/campground/:id/comment/:comment_id/delete",function(req,res){
comment.findByIdAndDelete(
req.params.comment_id,function(err){
 if(err)
 res.redirect("/campground");
 else
 res.redirect("/campground/"+req.params.id);

}
)
});

 //************* EDIT ROUTES ***************//
 
 app.get("/campground/:id/edit",function(req,res){
 Campground.findById(req.params.id,function(err,user){
   if(err)
   console.log(err);
   else
   res.render("campground/edit",{user:user});
 })
 });
 
 app.put("/campground/:id",function(req,res){
 Campground.findByIdAndUpdate(req.params.id,req.body.user,function(err,user){
 if(err)
 res.redirect("/campground/"+req.params.id+"/edit");
 else
 res.redirect("/campground/"+req.params.id);
 })
 });
  
 //************* DELETE ROUTES **********//

 app.get("/campground/:id/delete",function(req,res){
 Campground.findByIdAndRemove(req.params.id,function(err)
 {if(err)
  res.redirect("/campground/"+req.params.id);
  else
  res.redirect("/campground");
 })
 });

//************  USER AUTHNTICATE  *********//

app.get("/register",function(req,res){
res.render("Auth/register");
});

app.post("/register",function(req,res){
User.register(new User({username:req.body.username}),req.body.password,function(err,user){
if(err)
{console.log(err);
  return res.render("Auth/register");}
passport.authenticate("local")(req,res,function(){
 req.flash("success","Hey "+user.username+"! Welcome to campground.")
  res.redirect("/campground");
})
})});

app.get("/login",function(req,res){
  
  res.render("Auth/login");
});

app.post("/login",passport.authenticate("local",{
  successFlash:true,
 successRedirect:"/campground",
 failureFlash:true,
 failureRedirect:"/login",


}),function(req,res){
});

app.get("/logout",function(req,res){
  req.logout();
  req.flash("error"," Hey! you loggedOut.")
  res.redirect("/campground");
});

function isLoggedIn(req,res,next){
if(req.isAuthenticated())
return next();
req.flash("error","oops! you have to loggin first.");
res.redirect("/login");
};

  //************  APP LISTEN ************//

    app.listen(3000,function(){
    console.log(cat());
    });