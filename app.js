require('dotenv').config();

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const bodyParser = require('body-parser');
const Padai = require("./schema/padaiSchema");
const Physical = require("./schema/physicalSchema");
const Mental = require("./schema/mentalSchema");
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
    await mongoose.connect(process.env.ATLASDB_URL);
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
    let user = await User.findById(req.session.user).populate("padai").populate("physical").populate("mental");
    if (!user) {
        return res.redirect("/login");
    }
    let padaiTask = user.padai;
    let physicalTask = user.physical;
    let mentalTask = user.mental;
    
    let dataArray = user.hourTask;
// Get the current date
let now = new Date();

// Calculate the start date (30 days ago from the current date)
let startDate = new Date();
startDate.setDate(now.getDate() - 30);

// End date is the current date
let endDate = now;

function groupDatesInRange(dataArray, startDate, endDate) {
  let groupedDates = {};

  dataArray.forEach(item => {
    let date = new Date(item.date); // Ensure the date is a Date object
    if (date >= startDate && date <= endDate) {
      let dateString = date.toISOString().split('T')[0];
      if (!groupedDates[dateString]) {
        groupedDates[dateString] = [];
      }
      groupedDates[dateString].push(item);
    }
  });

  // Ensure each date in the range has at least an empty array
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    let dateString = d.toISOString().split('T')[0];
    if (!groupedDates[dateString]) {
      groupedDates[dateString] = [];
    }
  }

  // Convert the grouped dates object into an array of arrays
  return Object.entries(groupedDates).sort((a, b) => new Date(a[0]) - new Date(b[0]));
}

// Group the dates within the range
let datesInRange = groupDatesInRange(dataArray, startDate, endDate);
// console.log("Grouped dates within the range:", datesInRange);
// console.log("----------------------")
let datesOnly = datesInRange.map(entry => entry[0]);
let timeWorked = [];
for (let i = 0; i < datesInRange.length; i++) {
    console.log(datesInRange[i]);
  let timedone = 0;
  datesInRange[i][1].forEach(item => timedone += item.time);
  timeWorked.push(timedone);
}
console.log(timeWorked);
    res.render("index.ejs", { padaiTask,physicalTask,mentalTask,timeWorked,datesOnly });
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
  let user = await User.findById(req.session.user);
    user.hourTask.push({id:id,time:timeTomin,date:new Date()})
    await User.findByIdAndUpdate(req.session.user,user);
    console.log(user.hourTask);
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
});


//physical
app.get("/physical", (req, res) => {
    res.render("physicalTask.ejs");
});

app.post("/physical", async(req, res) => {
    let data=req.body.physical;
    data.left=data.target;
    console.log(data);
    let newTask=new Physical(data);
    console.log(newTask);
    await newTask.save();
    let user=await User.findById(req.session.user);
    user.physical.push(newTask);
    await User.findByIdAndUpdate(req.session.user,user)
    res.redirect("/");
});

app.get("/timer/physical/:id",async(req,res)=>{
  let {id}=req.params;
  let task=await Physical.findById(id);
  console.log(task);
  res.render("timer.ejs",{task})
});

app.post("/timer/physical/:id",async(req,res)=>{
  const { id } = req.params;
  const { time } = req.body;
  const timeTomin=(parseInt(time))/60;
  let task= await Physical.findById(id);
  let user = await User.findById(req.session.user);
    user.hourTask.push({id:id,time:timeTomin,date:new Date()})
    await User.findByIdAndUpdate(req.session.user,user);
    console.log(user.hourTask);
  task.left=task.left-timeTomin;
  if(task.left<=0) {task.left=0;}
  console.log(task.left);
  await Physical.findByIdAndUpdate(id,{ left: task.left });
  console.log(task);
  console.log(`Time received for id ${id}:`, timeTomin);
  res.redirect("/");
});

app.delete("/physical/:id",async(req,res)=>{
    const {id} =req.params;
    await Physical.findByIdAndDelete(id);
    res.redirect('/');
})

//mental

app.get("/mental", (req, res) => {
    res.render("mentalTask.ejs");
});

app.post("/mental", async(req, res) => {
    let data=req.body.mental;
    data.left=data.target;
    console.log(data);
    let newTask=new Mental(data);
    console.log(newTask);
    await newTask.save();
    let user=await User.findById(req.session.user);
    user.mental.push(newTask);
    await User.findByIdAndUpdate(req.session.user,user)
    res.redirect("/");
});

app.get("/timer/mental/:id",async(req,res)=>{
  let {id}=req.params;
  let task=await Mental.findById(id);
  console.log(task);
  res.render("timer.ejs",{task})
});

app.post("/timer/mental/:id",async(req,res)=>{
  const { id } = req.params;
  const { time } = req.body;
  const timeTomin=(parseInt(time))/60;
  let task= await Mental.findById(id);
  let user = await User.findById(req.session.user);
    user.hourTask.push({id:id,time:timeTomin,date:new Date()})
    await User.findByIdAndUpdate(req.session.user,user);
    console.log(user.hourTask);
  task.left=task.left-timeTomin;
  if(task.left<=0) {task.left=0;}
  console.log(task.left);
  await Mental.findByIdAndUpdate(id,{ left: task.left });
  console.log(task);
  console.log(`Time received for id ${id}:`, timeTomin);
  res.redirect("/");
});

app.delete("/mental/:id",async(req,res)=>{
    const {id} =req.params;
    await Mental.findByIdAndDelete(id);
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
        req.session.user=newUser._id;
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

