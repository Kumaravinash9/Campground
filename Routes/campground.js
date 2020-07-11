   var express      =  require("express"),
   route            =  express.Router(),
   User             = require("../models/User"),
   comment          = require("../models/comment"),
   Campground       = require("../models/Campground");
  
  

  route.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.message     = req.flash("error");
    res.locals.success     = req.flash("success");
    next();
  });

   // Campground
   route.get("/campground",function(req,res){
    Campground.find({},function(err,campground){
     if(err)
     console.log(err);
     else
     {
      
     res.render("index",{campground:campground});
  }})
    });
    
  //*******  NEW ROUTES   **********//
     
   route.get("/campground/new",isLoggedIn,function(req,res){
     res.render("campground/new");
    });

  //*******  CREATE ROUTES   *************//

route.post("/campground",function(req,res){
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

 route.get("/campground/:id",function(req,res){
    Campground.findById(req.params.id).populate("comment").exec(function(err,campground){
     if(err)
     console.log(err);
     else
     res.render("campground/show",{campground:campground});
    
    })
  });
  route.get("/campground/:id/edit",function(req,res){
    Campground.findById(req.params.id,function(err,user){
      if(err)
      console.log(err);
      else
      res.render("campground/edit",{user:user});
    })
    });
    
    route.put("/campground/:id",function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.user,function(err,user){
    if(err)
    res.redirect("/campground/"+req.params.id+"/edit");
    else
    res.redirect("/campground/"+req.params.id);
    })
    });
     
    //************* DELETE ROUTES **********//
   
    route.get("/campground/:id/delete",function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err)
    {if(err)
     res.redirect("/campground/"+req.params.id);
     else
     res.redirect("/campground");
    })
    });

    function isLoggedIn(req,res,next){
        if(req.isAuthenticated())
        return next();
        req.flash("error","oops! you have to loggin first.");
        res.redirect("/login");
        };
 
     module.exports =route;