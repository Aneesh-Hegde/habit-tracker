const mongoose = require("mongoose");
const passportLocalMongoose=require("passport-local-mongoose");
const userSchema=new mongoose.Schema({
    padai:{
        type:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Padai",
        }
        ]
    },
});

userSchema.plugin(passportLocalMongoose);

let User = mongoose.model('User', userSchema);

module.exports=User;
