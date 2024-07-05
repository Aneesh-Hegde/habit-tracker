//groups task from certain date range
const groupDatesInRange=(dataArray, startDate, endDate)=> {
  let groupedDates = {};

  dataArray.forEach((item) => {
    let date = new Date(item.date); // Ensure the date is a Date object
    if (date >= startDate && date <= endDate) {
      let dateString = date.toISOString().split("T")[0];
      if (!groupedDates[dateString]) {
        groupedDates[dateString] = [];
      }
      //from array of task bifurcate data. GroupDates is of form groupDates{date:[{task},{task}]}
      groupedDates[dateString].push(item);
    }
  });

  // Ensure each date in the range has at least an empty array
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    let dateString = d.toISOString().split("T")[0];
    if (!groupedDates[dateString]) {
      groupedDates[dateString] = [];
    }
  }

  // Convert the grouped dates object into an array of arrays
  return Object.entries(groupedDates).sort(
    (a, b) => new Date(a[0]) - new Date(b[0])
  );
}
module.exports=groupDatesInRange;
