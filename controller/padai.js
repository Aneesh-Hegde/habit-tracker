const Padai = require("../schema/padaiSchema");
const User = require("../schema/user");


module.exports.renderPadai= (req, res) => {
    res.render("padaiTask.ejs");
};

module.exports.addPadai=async(req, res) => {
    let data=req.body.padai;
    data.left=data.target;
    console.log(data);
    let newTask=new Padai(data);
    console.log(newTask);
    await newTask.save();
    let user=await User.findById(req.session.user);
    user.padai.push(newTask);
    user.hourTask.push({id:[newTask],time:0,date:new Date()});
    await User.findByIdAndUpdate(req.session.user,user)
    res.redirect("/");
};

module.exports.padaiTimer=async(req,res)=>{
  let {id}=req.params;
  let task=await Padai.findById(id);
  console.log(task);
  res.render("timer.ejs",{task})
};

module.exports.updatePadai=async(req,res)=>{
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
};

module.exports.deletePadai=async(req,res)=>{
    const {id} =req.params;
    await Padai.findByIdAndDelete(id);
    res.redirect('/');
};