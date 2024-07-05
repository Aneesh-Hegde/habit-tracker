const Padai = require("../schema/padaiSchema");
const Physical = require("../schema/physicalSchema");
const Mental = require("../schema/mentalSchema");
let padaiHourTask = [];
let physicalHourTask = [];
let mentalHourTask = [];
const userTask=async (user)=>{
    for (let i = 0; i < user.hourTask.length; i++) {
        if (await Padai.findById(user.hourTask[i].id[0])) {
          let task = await Padai.findById(user.hourTask[i].id[0]);
          padaiHourTask.push(user.hourTask[i]);
        } else if (await Physical.findById(user.hourTask[i].id[0])) {
          let task = await Physical.findById(user.hourTask[0].id[0]);
          physicalHourTask.push(user.hourTask[i]);
        }
        if (await Mental.findById(user.hourTask[i].id[0])) {
          let task = await Mental.findById(user.hourTask[0].id[0]);
          mentalHourTask.push(user.hourTask[i]);
        }
    }
    return{padaiHourTask,physicalHourTask,mentalHourTask}
}
module.exports=userTask;

