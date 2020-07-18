var express     = require("express"), 
    route       = express.Router(),
    passport    = require("passport"),
    flash       = require("connect-flash"),
    User        = require("../models/User");



    route.use(flash());
    route.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.message     = req.flash("error");
    res.locals.success     = req.flash("success");
    next();
    });


  /**************************Register Route********************************/


    route.get("/register",function(req,res){
    res.render("Auth/register");
    });
    

    route.post("/register",function(req,res){
    User.register(new User({username:req.body.username}),req.body.password,function(err,user){
    if(err)
    {console.log(err);
      return res.render("Auth/register");}
    passport.authenticate("local")(req,res,function(){
     req.flash("success","Hey "+user.username+"! Welcome to campground.")
      res.redirect("/campground");
    })})});
    


   /****************************LogIn Route*************************/

    route.get("/login",function(req,res){
      
      res.render("Auth/login");
    });
    
    route.post("/login",passport.authenticate("local",{
      successFlash:true,
     successRedirect:"/campground",
     failureFlash:true,
     failureRedirect:"/login",
    }),function(req,res){
    });
    
    route.get("/logout",function(req,res){
      req.logout();
      req.flash("error"," Hey! you loggedOut.")
      res.redirect("/campground");
    });
    
    
 /******************************Route********************************/

 
    module.exports =  route;