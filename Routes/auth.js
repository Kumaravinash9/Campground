var express = require("express"),
    flash   = require("connect-flash"),
route       = express.Router(),
passport    = require("passport"),
User        = require("../models/User");


route.use(flash());

route.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.message     = req.flash("error");
    res.locals.success     = req.flash("success");
    next();
    });

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
    
    

    module.exports =route;