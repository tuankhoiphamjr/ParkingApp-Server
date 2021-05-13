const dayMonthYearFormat = (date) => {
  const day = date.getDate() > 9 ? `${date.getDate()}` : `0${date.getDate()}`;
  const month =
    date.getMonth() + 1 > 9
      ? `${date.getMonth() + 1}`
      : `0${date.getMonth() + 1}`;
  const year =
    date.getFullYear() > 9 ? `${date.getFullYear()}` : `0${date.getDay()}`;
  return `${day}/${month}/${year}`;
};

const monthYearFormat = (date) => {
  const year =
    date.getFullYear() > 9 ? `${date.getFullYear()}` : `0${date.getDay()}`;
  const month =
    date.getMonth() + 1 > 9
      ? `${date.getMonth() + 1}`
      : `0${date.getMonth() + 1}`;
  return `${month}/${year}`;
};

const dateFormat = {
  dayMonthYearFormat,
  monthYearFormat,
};

module.exports = dateFormat;