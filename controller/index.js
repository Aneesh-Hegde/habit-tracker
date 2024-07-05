const Padai = require("../schema/padaiSchema");
const Physical = require("../schema/physicalSchema");
const Mental = require("../schema/mentalSchema");
const User = require("../schema/user");
const userTask=require("../utils/userTask");
const groupDatesInRange=require("../utils/groupDatesInRange");
module.exports.indexController = async (req, res) => {
  let user = await User.findById(req.session.user)
    .populate("padai")
    .populate("physical")
    .populate("mental");
  let padaiTask = user.padai;
  let physicalTask = user.physical;
  let mentalTask = user.mental;

  //creating hour task for seperate tasks
  let padaiHourTask = [];
  let physicalHourTask = [];
  let mentalHourTask = [];

  let alltask = await userTask(user);
  padaiHourTask = alltask.padaiHourTask;
  physicalHourTask = alltask.physicalHourTask;
  mentalHourTask = alltask.mentalHourTask;
  console.log(alltask);

  // Get the current date
  let now = new Date();

  // Calculate the start date (30 days ago from the current date)
  let startDate = new Date();
  // date of form 2024-07-04T17:33:06.486Z
  startDate.setDate(now.getDate() - 30);

  // End date is the current date
  let endDate = now;

  // Group the dates within the range
  let datesInRangeMental = groupDatesInRange(
    mentalHourTask,
    startDate,
    endDate
  );
  let datesInRangePadai = groupDatesInRange(padaiHourTask, startDate, endDate);
  let datesInRangePhysical = groupDatesInRange(
    physicalHourTask,
    startDate,
    endDate
  );

  // console.log("Grouped dates within the range:", datesInRange);
  // console.log("----------------------")
  //stores date for x axis in graph
  let datesOnlyMental = datesInRangeMental.map((entry) => entry[0]);
  let datesOnlyPhysical = datesInRangePadai.map((entry) => entry[0]);
  let datesOnlyPadai = datesInRangePhysical.map((entry) => entry[0]);
  let allDateInRange = [
    datesInRangeMental,
    datesInRangePhysical,
    datesInRangePadai,
  ];

  //stores time in minute on each day it represent y axis
  let padaiTimeWorked = [];
  let physicalTimeWorked = [];
  let mentalTimeWorked = [];
  for (let i = 0; i < 3; i++) {
    let datesInRange = allDateInRange[i];
    for (let j = 0; j < datesInRange.length; j++) {
      let timedone = 0;
      datesInRange[j][1].forEach((item) => (timedone += item.time));
      if (i == 0) {
        mentalTimeWorked.push(timedone);
      } else if (i == 1) {
        physicalTimeWorked.push(timedone);
      } else if (i == 2) {
        padaiTimeWorked.push(timedone);
      }
    }
  }
  //function to manipulate onlydate array to new form of date i.e date-month
  for (let i = 0; i < 3; i++) {
    let datesInRange;
    if (i == 0) {
      datesInRange = datesOnlyMental;
    } else if (i == 1) {
      datesInRange = datesOnlyPhysical;
    } else if (i == 2) {
      datesInRange = datesOnlyPadai;
    }
    for (let j = 0; j < datesInRange.length; j++) {
      let date =
        datesInRange[j].split("-")[2] + "-" + datesInRange[j].split("-")[1];
      datesInRange[j] = date;
    }
  }
  //current day task
  let currentDayPadai = [];
  let checkPadaiId = []; //array to check if dublicates are not there because hourTask has duplicate object as task get pushed once it is created and whenever finish in timer is clicked e.g hourtask=[{id:[id1]...} (when added),{{id:[id2]...}},{{id:[id1]...}}(when timer was used)]
  for (
    let i = 0;
    i < datesInRangePadai[datesInRangePadai.length - 1][1].length;
    i++
  ) {
    if (datesInRangePadai[datesInRangePadai.length - 1][1][i] != undefined) {
      //if loop to check if array is empty
      let task = await Padai.findById(
        datesInRangePadai[datesInRangePadai.length - 1][1][i].id[0]
      );
      if (checkPadaiId.includes(task.id)) continue;
      else {
        checkPadaiId.push(task.id);
        currentDayPadai.push(task);
      }
    }
  }
  let currentDayPhysical = [];
  let checkPhysicalId = [];
  for (
    let i = 0;
    i < datesInRangePadai[datesInRangePhysical.length - 1][1].length;
    i++
  ) {
    if (
      datesInRangePhysical[datesInRangePhysical.length - 1][1][i] != undefined
    ) {
      let task = await Physical.findById(
        datesInRangePhysical[datesInRangePhysical.length - 1][1][i].id[0]
      );
      if (checkPhysicalId.includes(task.id)) continue;
      else {
        checkPhysicalId.push(task.id);
        currentDayPhysical.push(task);
      }
    }
  }
  let currentDayMental = [];
  let checkMentalId = [];
  for (
    let i = 0;
    i < datesInRangeMental[datesInRangeMental.length - 1][1].length;
    i++
  ) {
    if (datesInRangeMental[datesInRangeMental.length - 1][1][i] != undefined) {
      let task = await Mental.findById(
        datesInRangeMental[datesInRangeMental.length - 1][1][i].id[0]
      );
      if (checkMentalId.includes(task.id)) continue;
      else {
        checkMentalId.push(task.id);
        currentDayMental.push(task);
      }
    }
  }

  res.render("index.ejs", {
    padaiTask,
    physicalTask,
    mentalTask,
    padaiTimeWorked,
    physicalTimeWorked,
    mentalTimeWorked,
    datesOnlyMental,
    datesOnlyPadai,
    datesOnlyPhysical,
    currentDayMental,
    currentDayPadai,
    currentDayPhysical,
  });
};
module.exports.indexController;
