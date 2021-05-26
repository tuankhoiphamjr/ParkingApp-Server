const moment = require("moment");

const dateDBFormat = (date) => {
  return (
    moment(date).format("DD/MM/YYYY") +
    " " +
    moment(date).format("HH:MM")
  );
};
console.log(
  dateDBFormat(new Date(Date.now()))
);
