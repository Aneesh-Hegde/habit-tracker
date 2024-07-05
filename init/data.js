const mongoose = require("mongoose");
const Mental = require("../schema/mentalSchema");
const Physical = require("../schema/physicalSchema");
const Padai = require("../schema/padaiSchema");
const User = require("../schema/user");

mongoose.connect("mongodb://127.0.0.1:27017/habittracker", { useNewUrlParser: true, useUnifiedTopology: true });

const userId = "6683a262ccb26e42d82c665c";

const generateRandomTasks = async () => {
    const mentalTasks = [];
    const physicalTasks = [];
    const padaiTasks = [];

    // Create sample tasks for mental, physical, and padai with left < target and left > 0
    for (let i = 0; i < 30; i++) {
        let target = Math.floor(Math.random() * 100) + 1;
        let left = Math.floor(Math.random() * target);
        if (left === 0) left = 1;

        let mental = new Mental({
            task: `Mental Task ${i + 1}`,
            type: "Mental",
            target: target,
            left: left,
        });
        await mental.save();
        mentalTasks.push(mental);

        target = Math.floor(Math.random() * 100) + 1;
        left = Math.floor(Math.random() * target);
        if (left === 0) left = 1;

        let physical = new Physical({
            task: `Physical Task ${i + 1}`,
            type: "Physical",
            target: target,
            left: left,
        });
        await physical.save();
        physicalTasks.push(physical);

        target = Math.floor(Math.random() * 100) + 1;
        left = Math.floor(Math.random() * target);
        if (left === 0) left = 1;

        let padai = new Padai({
            task: `Padai Task ${i + 1}`,
            type: "Padai",
            target: target,
            left: left,
        });
        await padai.save();
        padaiTasks.push(padai);
    }

    // Create tasks with left = 0 for the current date
    for (let i = 0; i < 3; i++) {
        let mental = new Mental({
            task: `Current Date Mental Task ${i + 1}`,
            type: "Mental",
            target: Math.floor(Math.random() * 100) + 1,
            left: 0,
        });
        await mental.save();
        mentalTasks.push(mental);

        let physical = new Physical({
            task: `Current Date Physical Task ${i + 1}`,
            type: "Physical",
            target: Math.floor(Math.random() * 100) + 1,
            left: 0,
        });
        await physical.save();
        physicalTasks.push(physical);

        let padai = new Padai({
            task: `Current Date Padai Task ${i + 1}`,
            type: "Padai",
            target: Math.floor(Math.random() * 100) + 1,
            left: 0,
        });
        await padai.save();
        padaiTasks.push(padai);
    }

    // Generate random hour tasks for each day ensuring at least 5 of each type
    const hourTasks = [];
    const ensureTasks = (taskArray, count) => {
        const tasks = [];
        for (let i = 0; i < count; i++) {
            tasks.push({
                id: taskArray[Math.floor(Math.random() * taskArray.length)]._id,
                time: Math.floor(Math.random() * 60),
                date: new Date(),
            });
        }
        return tasks;
    };

    hourTasks.push(...ensureTasks(mentalTasks, 5));
    hourTasks.push(...ensureTasks(physicalTasks, 5));
    hourTasks.push(...ensureTasks(padaiTasks, 5));

    // Add more random hour tasks for the rest of the days
    for (let day = 0; day < 30; day++) {
        let date = new Date();
        date.setDate(date.getDate() - day);

        for (let hour = 0; hour < 24; hour++) {
            if (Math.random() < 0.5) {
                let taskType = Math.floor(Math.random() * 3); // 0 for mental, 1 for physical, 2 for padai
                let task;
                if (taskType === 0) {
                    task = mentalTasks[Math.floor(Math.random() * mentalTasks.length)];
                } else if (taskType === 1) {
                    task = physicalTasks[Math.floor(Math.random() * physicalTasks.length)];
                } else {
                    task = padaiTasks[Math.floor(Math.random() * padaiTasks.length)];
                }

                if (task) {
                    hourTasks.push({
                        id: task._id, // Only take the first task ID
                        time: Math.floor(Math.random() * 60),
                        date: new Date(date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60))),
                    });
                }
            }
        }
    }

    // Find the user by ID and update
    let user = await User.findById(userId);
    if (user) {
        user.mental.push(...mentalTasks.map(task => task._id));
        user.physical.push(...physicalTasks.map(task => task._id));
        user.padai.push(...padaiTasks.map(task => task._id));
        user.hourTask.push(...hourTasks);
        await user.save();
        console.log("Tasks added to the existing user.");
    } else {
        console.log("User not found.");
    }
};

generateRandomTasks().then(() => {
    mongoose.connection.close();
}).catch(err => {
    console.error(err);
    mongoose.connection.close();
});
