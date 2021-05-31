function reservationValidator(data) {
  const {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  } = data;
  const data2 = {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  };
  const dataMap = new Map(Object.entries(data2));
  const dataKeys = Object.keys(data2);
  const invalidFields = [];

  const validFields = new Set([
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
  ]);

  dataMap.forEach((value, key) => {
    if (value === "" || value === undefined || !validFields.has(key)) {
      invalidFields.push(key);
    }
  });

  validFields.forEach((field) => {
    if (!dataKeys.includes(field) && !invalidFields.includes(field))
      invalidFields.push(field);
  });

  if (dataMap.get("people") <= 0 || typeof dataMap.get("people") !== "number") {
    if (!invalidFields.includes("people")) invalidFields.push("people");
  }

  if (!/^\d{2}:\d{2}$/.test(dataMap.get("reservation_time"))) {
    if (!invalidFields.includes("reservation_time"))
      invalidFields.push("reservation_time");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dataMap.get("reservation_date"))) {
    if (!invalidFields.includes("reservation_date"))
      invalidFields.push("reservation_date");
  }

  return invalidFields;
}

// const data = {
//   first_name: "first",
//   last_name: "",
//   mobile_number: "800-555-1212",
//   reservation_date: "2025-01-01",
//   reservation_time: "13:30",
//   people: 1,
// };
//console.log(reservationValidator(data));

module.exports = reservationValidator;
