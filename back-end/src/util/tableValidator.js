function tableValidator(data, validFields) {
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

  if (
    dataMap.get("capacity") <= 0 ||
    typeof dataMap.get("capacity") !== "number"
  ) {
    if (!invalidFields.includes("capacity")) invalidFields.push("capacity");
  }

  return invalidFields;
}

module.exports = tableValidator;
