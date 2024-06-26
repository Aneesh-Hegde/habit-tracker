require('dotenv').config();

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const bodyParser = require('body-parser');
const Padai = require("./schema/padaiSchema");
const User = require("./schema/user");
const passport = require("passport");
const LocalStratergy = require("passport-local");
const MongoStore=require("connect-mongo");
const session = require("express-session");




app.listen(8080, () => {
    console.log("app is listening on port 8081");
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
    mongoUrl: "mongodb://127.0.0.1:27017/habittracker",
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
    await mongoose.connect("mongodb://127.0.0.1:27017/habittracker");
}

main()
    .then(() => {
        console.log("connection successful");
    })
    .catch((err) => console.log(err));

// Route handlers
app.get("/", async (req, res) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    let user = await User.findById(req.session.user).populate("padai");
    if (!user) {
        return res.redirect("/login");
    }
    let padaiTask = user.padai;
    res.render("index.ejs", { padaiTask });
});

app.get("/padai", (req, res) => {
    res.render("padaiTask.ejs");
});

app.post("/padai", async(req, res) => {
    let data=req.body.padai;
    data.left=data.target;
    console.log(data);
    let newTask=new Padai(data);
    console.log(newTask);
    await newTask.save();
    let user=await User.findById(req.session.user);
    user.padai.push(newTask);
    await User.findByIdAndUpdate(req.session.user,user)
    res.redirect("/");
});

app.get("/timer/padai/:id",async(req,res)=>{
  let {id}=req.params;
  let task=await Padai.findById(id);
  console.log(task);
  res.render("timer.ejs",{task})
});

app.post("/timer/padai/:id",async(req,res)=>{
  const { id } = req.params;
  const { time } = req.body;
  const timeTomin=(parseInt(time))/60;
  let task= await Padai.findById(id);
  task.left=task.left-timeTomin;
  if(task.left<=0) {task.left=0;}
  console.log(task.left);
  await Padai.findByIdAndUpdate(id,{ left: task.left });
  console.log(task);
  console.log(`Time received for id ${id}:`, timeTomin);
  res.redirect("/");
});

app.delete("/padai/:id",async(req,res)=>{
    const {id} =req.params;
    await Padai.findByIdAndDelete(id);
    res.redirect('/');
})


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
        console.log(registeredUser);
        res.redirect("/");
    }catch(err){
        console.log(err);
        res.redirect("/signup");
    }
})

// const express = require("express");
// const app = express();
// const path = require("path");
// const mongoose = require("mongoose");
// const methodOverride = require("method-override");
// const ejsMate = require("ejs-mate");
// const bodyParser = require('body-parser');
// const Padai=require("./schema/padaiSchema");
// app.listen(8080, () => {
//     console.log("app is listening through port 8080");
//   });
//   app.set("views", path.join(__dirname, "views"));
//   app.set("view engine", "ejs");
  
//   //static files
//   app.use(express.static(path.join(__dirname, "public")));
//   app.use(methodOverride("_method"));
//   app.use(express.urlencoded({ extended: true }));
//   //using ejs templete(boilerplate)
//   app.engine("ejs", ejsMate);
//   app.use(bodyParser.urlencoded({ extended: true }));

//   main()
//   .then(() => {
//     console.log("connection successful");
//   })
//   .catch((err) => console.log(err));


// async function main() {
//   await mongoose.connect("mongodb://127.0.0.1:27017/habittracker");  //mongodb://127.0.0.1:27017/wanderlust
// }

// app.get("/",async(req,res)=>{
//   let padaiTask=await Padai.find({});
//     res.render("index.ejs",{padaiTask});
// });
// app.get("/padai",async(req,res)=>{
  
//   res.render("padaiTask.ejs");
// });

// app.post("/padai",(req,res)=>{
//   console.log(req.body);
//   res.redirect("/");
// })

