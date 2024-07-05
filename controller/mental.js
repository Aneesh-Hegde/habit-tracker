const Mental = require("../schema/mentalSchema");
const User = require("../schema/user");

module.exports.renderPhysical=(req, res) => {
    res.render("mentalTask.ejs");
}

module.exports.addMental=async(req, res) => {
    let data=req.body.mental;
    data.left=data.target;
    console.log(data);
    let newTask=new Mental(data);
    console.log(newTask);
    await newTask.save();
    let user=await User.findById(req.session.user);
    user.mental.push(newTask);
    user.hourTask.push({id:[newTask],time:0,date:new Date()});
    await User.findByIdAndUpdate(req.session.user,user)
    res.redirect("/");
};

module.exports.mentalTimer=async(req,res)=>{
    let {id}=req.params;
  let task=await Mental.findById(id);
  console.log(task);
  res.render("timer.ejs",{task})
};

module.exports.updateMental=async(req,res)=>{
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
};

module.exports.deleteMental=async(req,res)=>{
    const {id} =req.params;
    await Mental.findByIdAndDelete(id);
    res.redirect('/');
};