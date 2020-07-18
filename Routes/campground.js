   var express      =  require("express"),
   route            =  express.Router(),
   Campground       = require("../models/Campground"),
   flash            =  require("connect-flash"),
   path             = require("path"),
   multer           = require("multer"),
   fs               = require("fs");
  
/*********************Multer Config  ******************/

   route.use(flash());

   var storage = multer.diskStorage({
    
    destination:function(req,file,cb){
      cb(null,'Uploads/image')
    },
    filename:function(req,file,cb){
      cb(null,file.fieldname+"-"+Date.now()+path.extname(file.originalname))
    }
   });
   var upload = multer({
     storage:storage
   });


    route.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.message     = req.flash("error");
    res.locals.success     = req.flash("success");
    next();
  });

   //**********Campground  **********/

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

route.post("/campground",upload.single("image"),function(req,res,next){
  Campground.create({
           title:req.body.title,
           
           description:req.body.description,
           image:{
             imagelocation:'../Uploads/image/'+req.file.filename,
             data:fs.readFileSync(path.join('Uploads/image/'+req.file.filename)),
             contentType:req.file.mimetype
           }
          
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

  //***********  EDIT ROUTE   *************/

  route.get("/campground/:id/edit",function(req,res){
    Campground.findById(req.params.id,function(err,campground){
      if(err)
      console.log(err);
      else
      res.render("campground/edit",{campground:campground});
    })
    });
    

    route.put("/campground/:id",upload.single("image"),function(req,res,next){
    Campground.findByIdAndUpdate(req.params.id,{
      title:req.body.campground.title,
      description:req.body.campground.description,
      image:{
        imagelocation:'../Uploads/image/'+req.file.filename,
        data:fs.readFileSync(path.join('Uploads/image/'+req.file.filename)),
        contentType:req.file.mimetype
      }
    },function(err,campground){
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
    
//***************LogIn MiddleWare ***********/
    function isLoggedIn(req,res,next){
        if(req.isAuthenticated())
        return next();
        req.flash("error","oops! you have to loggin first.");
        res.redirect("/login");
        };
 
//*******************Exports  **************/

     module.exports =route;