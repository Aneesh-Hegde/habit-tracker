const datesOnlyPadai=window.datesOnlyPadai;
const padaiTimeWorked=window.padaiTimeWorked;
const datesOnlyMental=window.datesOnlyMental;
const mentalTimeWorked=window.mentalTimeWorked;
const datesOnlyPhysical=window.datesOnlyPhysical;
const physicalTimeWorked=window.physicalTimeWorked;
const currentDayMental=window.currentDayMental;
const currentDayPadai=window.currentDayPadai;
const currentDayPhysical=window.currentDayPhysical;
const physicalTask=window.physicalTask;
const padaiTask=window.padaiTask;
const mentalTask=window.mentalTask;

const physicalCtx = document.getElementById("physicalMyChart");
const padaiCtx = document.getElementById("padaiMyChart");
const mentalCtx = document.getElementById("mentalMyChart");
const physicalDonutCtx = document.getElementById("physicalMyChartDonut");
const padaiDonutCtx = document.getElementById("padaiMyChartDonut");
const mentalDonutCtx = document.getElementById("mentalMyChartDonut");
let completedPhysical = 0;
let completedPadai = 0;
let completedMental = 0;
console.log(currentDayMental);
for (let i = 0; i < currentDayMental.length; i++) {
  if (currentDayMental[i]) {
    if (currentDayMental[i].left == 0) completedMental += 1;
  }
}
for (let i = 0; i < currentDayPadai.length; i++) {
  if (currentDayPadai[i]) {
    if (currentDayPadai[i].left == 0) completedPadai += 1;
  }
}
// console.log(currentDayPhysical);
for (let i = 0; i < currentDayPhysical.length; i++) {
  if (currentDayPhysical[i]) {
    if (currentDayPhysical[i].left == 0) completedPhysical += 1;
  }
}
let incompletedPhysical = currentDayPhysical.length - completedPhysical;
let incompletedPadai = currentDayPadai.length - completedPadai;
let incompletedMental = currentDayMental.length - completedMental;

console.log(completedMental, incompletedMental);
new Chart(physicalCtx, {
  type: "bar",
  data: {
    labels: datesOnlyPhysical,
    datasets: [
      {
        label: "Graph",
        data: physicalTimeWorked,
        backgroundColor: "#FF9E40",
        borderWidth: 1,
      },
    ],
  },
  options: {
    plugins: {
      // changin the lagend colour
      legend: {
        labels: {
          color: "grey",
        },
      },
      title: {
        display: true,
        text: "Physical",
      },
    },
    scales: {
      y: {
        ticks: { color: "grey", beginAtZero: true },
        title: {
          display: true,
          text: "Minutes", // Name of x-axis
        },
        beginAtZero: true,
      },
      x: {
        ticks: { color: "grey", beginAtZero: true },
        title: {
          display: true,
          text: "Dates", // Name of x-axis
        },
        beginAtZero: true,
      },
    },
  },
});
new Chart(padaiCtx, {
  type: "bar",
  data: {
    labels: datesOnlyPadai,
    datasets: [
      {
        label: "Graph",
        data: padaiTimeWorked,
        backgroundColor: "#FF6283",
        borderWidth: 1,
      },
    ],
  },
  options: {
    plugins: {
      // changin the lagend colour
      legend: {
        labels: {
          color: "grey",
        },
      },
      title: {
        display: true,
        text: "Study",
      },
    },
    scales: {
      y: {
        ticks: { color: "grey", beginAtZero: true },
        title: {
          display: true,
          text: "Minutes", // Name of x-axis
        },
        beginAtZero: true,
      },
      x: {
        ticks: { color: "grey", beginAtZero: true },
        title: {
          display: true,
          text: "Dates", // Name of x-axis
        },
        beginAtZero: true,
      },
    },
  },
});
new Chart(mentalCtx, {
  type: "bar",
  data: {
    labels: datesOnlyMental,
    datasets: [
      {
        label: "Graph",
        data: mentalTimeWorked,
        backgroundColor: "#36A2EB",
        borderWidth: 1,
      },
    ],
  },
  options: {
    plugins: {
      // changin the lagend colour
      legend: {
        labels: {
          color: "grey",
        },
      },
      title: {
        display: true,
        text: "Mental",
      },
    },
    scales: {
      y: {
        ticks: { color: "grey", beginAtZero: true },
        title: {
          display: true,
          text: "Minutes", // Name of x-axis
        },
        beginAtZero: true,
      },
      x: {
        ticks: { color: "grey", beginAtZero: true },
        title: {
          display: true,
          text: "Dates", // Name of x-axis
        },
        beginAtZero: true,
      },
    },
  },
});
//donuts
//   console.log(completedPhysical,incompletedPhysical)
new Chart(physicalDonutCtx, {
  type: "doughnut",
  data: {
    labels: ["Completed", "Incompleted"],
    datasets: [
      {
        label: "My First Dataset",
        data: [completedPhysical, incompletedPhysical],
        backgroundColor: ["hsl(100, 100%, 60%)", "#777"],
        hoverOffset: 4,
      },
    ],
  },
  options: {
    plugins: {
      title: {
        display: true,
        text: "Physical",
      },
    },
  },
});
new Chart(padaiDonutCtx, {
  type: "doughnut",
  data: {
    labels: ["Completed", "Incompleted"],
    datasets: [
      {
        label: "My First Dataset",
        data: [completedPadai, incompletedPadai],
        backgroundColor: ["hsl(100, 100%, 60%)", "#777"],
        hoverOffset: 4,
      },
    ],
  },
  options: {
    plugins: {
      title: {
        display: true,
        text: "Study",
      },
    },
  },
});
new Chart(mentalDonutCtx, {
  type: "doughnut",
  data: {
    labels: ["Completed", "Incompleted"],
    datasets: [
      {
        label: "My First Dataset",
        data: [completedMental, incompletedMental],
        backgroundColor: ["hsl(100, 100%, 60%)", "#777"],
        hoverOffset: 4,
      },
    ],
  },
  options: {
    plugins: {
      title: {
        display: true,
        text: "Mental",
      },
    },
  },
});

//task donut
for (let task of physicalTask) {
  if (task.left == 0) continue;
  let taskCtx = `${task._id}Donut`;
  new Chart(taskCtx, {
    type: "doughnut",
    data: {
      labels: ["Completed", "Incompleted"],
      datasets: [
        {
          label: "My First Dataset",
          data: [task.target - task.left, task.left],
          backgroundColor: ["hsl(100, 100%, 60%)", "#777"],
          hoverOffset: 4,
        },
      ],
    },
  });
}

for (let task of padaiTask) {
  if (task.left == 0) continue;
  let taskCtx = `${task._id}Donut`;
  new Chart(taskCtx, {
    type: "doughnut",
    data: {
      labels: ["Completed", "Incompleted"],
      datasets: [
        {
          label: "My First Dataset",
          data: [task.target - task.left, task.left],
          backgroundColor: ["hsl(100, 100%, 60%)", "#777"],
          hoverOffset: 4,
        },
      ],
    },
  });
}

for (let task of mentalTask) {
  if (task.left == 0) continue;
  let taskCtx = `${task._id}Donut`;
  new Chart(taskCtx, {
    type: "doughnut",
    data: {
      labels: ["Completed", "Incompleted"],
      datasets: [
        {
          label: "My First Dataset",
          data: [task.target - task.left, task.left],
          backgroundColor: ["hsl(100, 100%, 60%)", "#777"],
          hoverOffset: 4,
        },
      ],
    },
  });
}
