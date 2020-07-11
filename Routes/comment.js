var express      =  require("express"),
route            =  express.Router(),
User             =  require("../models/User"),
comment          =  require("../models/comment"),
Campground       =  require("../models/Campground");
 



route.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.message     = req.flash("error");
    res.locals.success     = req.flash("success");
    next();
  });


route.get("/campground/:id/comment/new",isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
      if(err)
     console.log(err);
     else
     res.render("comment/new",{campground:campground});
    })
   });
 
  //                       Post Route                           //
 
  route.post("/campground/:id/comment",function(req,res){
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

route.get("/campground/:id/comment/:comment_id/edit",function(req,res){
 comment.findById(req.params.comment_id,function(err,comment){
 if(err)
 res.redirect("/campground/"+req.params.id);
 else
 {res.render("comment/show",{
   comment:comment,campgroundid:req.params.id
 })}})});
 
  //                  UPDATE                //
 
 route.put("/campground/:id/comment/:comment_id",function(req,res){
  comment.findByIdAndUpdate(
   req.params.comment_id,{text:req.body.text},function(err,comment){
 if(err)
 res.redirect("/campground");
 else
 res.redirect("/campground/"+req.params.id);
   }
  )
 
 });


 route.get("/campground/:id/comment/:comment_id/delete",function(req,res){
 comment.findByIdAndDelete(
 req.params.comment_id,function(err){
  if(err)
  res.redirect("/campground");
  else
  res.redirect("/campground/"+req.params.id);
 
 }
 )
 });

  function isLoggedIn(req,res,next){
    if(req.isAuthenticated())
    return next();
    req.flash("error","oops! you have to loggin first.");
    res.redirect("/login");
    };
    module.exports =route;