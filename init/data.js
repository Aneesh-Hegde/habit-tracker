const mongoose = require("mongoose");
const Mental = require("../schema/mentalSchema");
const Physical = require("../schema/physicalSchema");
const Padai = require("../schema/padaiSchema");
const User = require("../schema/user");

mongoose.connect("mongodb://127.0.0.1:27017/habittracker", { useNewUrlParser: true, useUnifiedTopology: true });

const userId = "6681325c257917e761c9214f";

const generateRandomTasks = async () => {
    const mentalTasks = [];
    const physicalTasks = [];
    const padaiTasks = [];

    // Create sample tasks for mental, physical, and padai
    for (let i = 0; i < 30; i++) {
        let mental = new Mental({
            task: `Mental Task ${i + 1}`,
            type: "Mental",
            target: Math.floor(Math.random() * 100) + 1,
            left: Math.floor(Math.random() * 100) + 1,
        });
        await mental.save();
        mentalTasks.push(mental);

        let physical = new Physical({
            task: `Physical Task ${i + 1}`,
            type: "Physical",
            target: Math.floor(Math.random() * 100) + 1,
            left: Math.floor(Math.random() * 100) + 1,
        });
        await physical.save();
        physicalTasks.push(physical);

        let padai = new Padai({
            task: `Padai Task ${i + 1}`,
            type: "Padai",
            target: Math.floor(Math.random() * 100) + 1,
            left: Math.floor(Math.random() * 100) + 1,
        });
        await padai.save();
        padaiTasks.push(padai);
    }

    // Generate random hour tasks for each day
    const hourTasks = [];
    for (let day = 0; day < 30; day++) {
        let date = new Date();
        date.setDate(date.getDate() - day);

        let tasks = [];
        if (Math.random() < 0.33) tasks.push(mentalTasks[Math.floor(Math.random() * mentalTasks.length)]._id);
        if (Math.random() < 0.33) tasks.push(physicalTasks[Math.floor(Math.random() * physicalTasks.length)]._id);
        if (Math.random() < 0.33) tasks.push(padaiTasks[Math.floor(Math.random() * padaiTasks.length)]._id);
        
        if (tasks.length > 0) {
            hourTasks.push({
                id: tasks[0], // Only take the first task ID
                time: Math.floor(Math.random() * 60),
                date: new Date(date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60))),
            });
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
