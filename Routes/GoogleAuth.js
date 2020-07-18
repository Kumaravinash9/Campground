var express   = require("express"),
    route     = express.Router(),
    User      = require("../models/User"),
    passport  = require("passport");
  
    


  //             GoogleInfo Route 

    route.get('/google',
    passport.authenticate('google', { scope: ['profile'] }));
  

  //              CalllBack Route

    route.get('/googleAuth', 
    passport.authenticate('google', { failureRedirect: '/login',successRedirect:"/campground" }),
    function(req, res) {
      
    });


  //                  Export


module.exports=route;