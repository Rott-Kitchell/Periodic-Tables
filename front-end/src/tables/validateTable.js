export default function validateTable(formData, setDateErrors) {
  const foundErrors = [];

  if (formData.table_name.length < 2) {
    foundErrors.push({
      message: "Table_name must be more than one character",
    });
  }

  if (formData.capacity < 1) {
    foundErrors.push({
      message: "capacity must be more than 0",
    });
  }

  setDateErrors(foundErrors);

  console.log(foundErrors.length > 0, "validate");
  if (foundErrors.length > 0) {
    return false;
  }
  // if we get here, our reservation date is valid!
  return true;
}
