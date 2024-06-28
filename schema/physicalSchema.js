const mongoose = require("mongoose");

let physicalSchema= new mongoose.Schema({
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

let Physical=mongoose.model("Physical",physicalSchema);
module.exports=Physical;