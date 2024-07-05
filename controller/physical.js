const Physical = require("../schema/physicalSchema");
const User = require("../schema/user");

module.exports.renderPhysical=(req, res) => {
    res.render("physicalTask.ejs");
}

module.exports.addPhysical=async(req, res) => {
    let data=req.body.physical;
    data.left=data.target;
    console.log(data);
    let newTask=new Physical(data);
    console.log(newTask);
    await newTask.save();
    let user=await User.findById(req.session.user);
    user.physical.push(newTask);
    user.padai.push(newTask);
    user.hourTask.push({id:[newTask],time:0,date:new Date()});
    await User.findByIdAndUpdate(req.session.user,user)
    res.redirect("/");
};

module.exports.physicalTimer=async(req,res)=>{
    let {id}=req.params;
    let task=await Physical.findById(id);
    console.log(task);
    res.render("timer.ejs",{task})
};

module.exports.updatePhysical=async(req,res)=>{
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
};

module.exports.deletePhysical=async(req,res)=>{
    const {id} =req.params;
    await Physical.findByIdAndDelete(id);
    res.redirect('/');
};