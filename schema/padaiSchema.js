const mongoose = require("mongoose");

let padaiSchema= new mongoose.Schema({
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

let Padai=mongoose.model("Padai",padaiSchema);
module.exports=Padai;