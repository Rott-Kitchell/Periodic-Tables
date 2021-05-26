function tableValidator(data, validFields) {
  const dataMap = new Map(Object.entries(data));
  const dataKeys = Object.keys(data);
  const invalidFields = [];

  if (dataKeys.includes("reservation_id")) validFields.add("reservation_id");

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
  let tableName;
  if (dataMap.get("table_name"))
    tableName = dataMap.get("table_name").split("");

  if (!dataMap.get("table_name") || tableName.length < 2) {
    if (!invalidFields.includes("table_name")) invalidFields.push("table_name");
  }

  return invalidFields;
}

module.exports = tableValidator;
