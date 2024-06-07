const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const bodyParser = require('body-parser');
const Padai = require("./schema/padaiSchema");

app.listen(8080, () => {
    console.log("app is listening on port 8080");
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
    let padaiTask = await Padai.find({});
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
  await Padai.findByIdAndUpdate(id,task);
  console.log(task);
  console.log(`Time received for id ${id}:`, timeTomin);
});

app.delete("/padai/:id",async(req,res)=>{
    const {id} =req.params;
    await Padai.findByIdAndDelete(id);
    res.redirect('/');
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

