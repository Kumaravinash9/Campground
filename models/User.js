var mongoose        = require("mongoose"),
passportLocalMong   = require("passport-local-mongoose"),
Schema              = new mongoose.Schema({
    username:String,
    passport:String,
    googleId:String,
   
    
});
Schema.plugin(passportLocalMong);
module.exports=mongoose.model("user",Schema);