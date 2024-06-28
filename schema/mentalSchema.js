const mongoose = require("mongoose");

let mentalSchema= new mongoose.Schema({
    task:{
        type:String,
        required:true,
    },
    type:{
        type:String,
        required:true,
    },
    target:{
        type:Number,
        required:true,
    },
    left:{
        type:Number,
    }
});

let Mental=mongoose.model("Mental",mentalSchema);
module.exports=Mental;