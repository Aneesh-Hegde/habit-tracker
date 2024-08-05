require('dotenv').config();

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const bodyParser = require('body-parser');
const User = require("./schema/user");
const passport = require("passport");
const LocalStratergy = require("passport-local");
const MongoStore=require("connect-mongo");
const session = require("express-session");
const index=require("./routes/index");
const padai=require("./routes/padai");
const physical=require("./routes/physical");
const mental=require("./routes/mental");



app.listen(8080, () => {
    console.log("app is listening on port 5325");
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Static files
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

// Using EJS template (boilerplate)
app.engine("ejs", ejsMate);
app.use(bodyParser.urlencoded({ extended: true }));

//session parameter
const store=MongoStore.create({
    mongoUrl: "mongodb://127.0.0.1:27017/habittracker",//mongodb://127.0.0.1:27017/habittracker
    crypto: {
      secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
  });
//express session
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly:true,
    }
  };
  
  
  app.use(session(sessionOptions));
//password initialization
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Connect to MongoDB
async function main() {
    await mongoose.connect(process.env.ATLASDB_URL);
}

main()
    .then(() => {
        console.log("connection successful");
    })
    .catch((err) => console.log(err));

// Route handlers
app.use("/", index);

app.use("/padai",padai);


//physical
app.use("/physical",physical)

//mental

app.use("/mental", mental)


app.get("/login",(req,res)=>{
    res.render("login.ejs");
});
app.post("/login",passport.authenticate("local",{failureRedirect:"/login"}),async(req,res)=>{
    let user=await User.findById(req.user._id);
    req.session.user=req.user._id;
    console.log(req.session.user);
    console.log(user);
    res.redirect("/");
})

app.get("/signup",(req,res)=>{
    res.render("signup.ejs")
})

app.post("/signup",async(req,res)=>{
    try{
        let  {username,password}=req.body;
        let newUser=new User({username,password});
        let registeredUser=await User.register(newUser,password);
        req.session.user=newUser._id;
        console.log(registeredUser);
        res.redirect("/");
    }catch(err){
        console.log(err);
        res.redirect("/signup");
    }
})


