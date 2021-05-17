export default function validateDate(formData, setDateErrors) {
  console.log(formData);
  const reserveDate = new Date(
    `${formData.reservation_date} ${formData.reservation_time} GMT-0500`
  );
  console.log(reserveDate, "reserve");

  const todaysDate = new Date();

  const foundErrors = [];

  if (reserveDate.getDay() === 2) {
    foundErrors.push({
      message:
        "Reservations cannot be made on a Tuesday (Restaurant is closed).",
    });
  }
  if (reserveDate < todaysDate) {
    foundErrors.push({
      message: "Reservations cannot be made in the past.",
    });
  }
  setDateErrors(foundErrors);

  if (foundErrors.length > 0) {
    return false;
  }
  // if we get here, our reservation date is valid!
  return true;
}
