function reservationValidator(data, validFields) {
  const dataMap = new Map(Object.entries(data));
  const dataKeys = Object.keys(data);
  const invalidFields = [];

  dataMap.forEach((value, key) => {
    if (value === "" || !validFields.has(key)) invalidFields.push(key);
  });

  validFields.forEach((field) => {
    if (!dataKeys.includes(field) && !invalidFields.includes(field)) {
      invalidFields.push(field);
    }
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

module.exports = reservationValidator;
