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
    hourTask:[{
        id:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Mental",
        },{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Physical",
        },{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Padai",
        }],
        time:{
            type:Number,
        },
        date:{
            type:Date,
        }
    }]
});

userSchema.plugin(passportLocalMongoose);

let User = mongoose.model('User', userSchema);

module.exports=User;
