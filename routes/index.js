const express = require("express");
const router=express.Router();
const {indexController}=require("../controller/index");
const isLoggedIn=require("../middleware");
router.route("/")
.get(isLoggedIn,indexController);
module.exports=router;