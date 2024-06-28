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
    physical:{
        type:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Physical",
        }
        ]
    },
    mental:{
        type:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Mental",
        }
        ]
    },
});

userSchema.plugin(passportLocalMongoose);

let User = mongoose.model('User', userSchema);

module.exports=User;
