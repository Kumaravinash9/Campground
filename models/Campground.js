var mongoose = require("mongoose"),
    Schema   = new mongoose.Schema({
         title: String,
         image: String,
         description:String,
         comment:[{type:mongoose.Schema.Types.ObjectId,ref:"comment"}],
         date:{
            type:Date,default:Date.now()
        },
        author:{
            id:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
            username:String
            }
        }
         
    );
module.exports = mongoose.model("Campground",Schema);