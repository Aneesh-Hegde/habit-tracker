const express=require("express");
const app=express();
const passport = require("passport");

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