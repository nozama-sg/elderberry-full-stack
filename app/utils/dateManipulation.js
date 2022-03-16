const toTwoPlace = (num) => {
  return num.toString().length > 1 ? num : "0" + num.toString();
};
module.exports.dateToStr = (d) => {
  const dayArr = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
  const monArr = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  return `${dayArr[d.getDay()]}, ${d.getDate()} ${
    monArr[d.getMonth()]
  } ${d.getFullYear()} ${d.getHours()}:${toTwoPlace(
    d.getMinutes()
  )}:${toTwoPlace(d.getSeconds())}`;
};

module.exports.dateToDaysAndTime = (d) => {
  const daysDiff = Math.trunc(
    (new Date().getTime() - d.getTime()) / (24 * 60 * 60 * 1000)
  );

  if (daysDiff == 0) {
    return `Today, ${d.getHours()}:${toTwoPlace(d.getMinutes())}:${toTwoPlace(
      d.getSeconds()
    )}`;
  } else if (daysDiff == 1) {
    return `Yesterday, ${d.getHours()}:${toTwoPlace(
      d.getMinutes()
    )}:${toTwoPlace(d.getSeconds())}`;
  } else {
    return `${Math.abs(daysDiff)} days ago, ${d.getHours()}:${toTwoPlace(
      d.getMinutes()
    )}:${toTwoPlace(d.getSeconds())}`;
  }
};

module.exports.dateToDay = (d) => {
  const dNow = new Date();
  const utc1 = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  const utc2 = Date.UTC(dNow.getFullYear(), dNow.getMonth(), dNow.getDate());

  const daysDiff = Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));

  if (daysDiff == 0) {
    return `Today`;
  } else if (daysDiff == 1) {
    return `Yesterday`;
  } else {
    return `${Math.abs(daysDiff)} days ago`;
  }
};

module.exports.dateToTime = (d) => {
  return `${d.getHours()}:${toTwoPlace(d.getMinutes())}`;
};

module.exports.getHAgo = (d) => {
  const hAgo = Math.round(
    (new Date().getTime() - d.getTime()) / (60 * 60 * 1000)
  );
  return hAgo;
};
