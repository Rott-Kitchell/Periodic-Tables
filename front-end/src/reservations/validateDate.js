export default function validateDate(formData, setDateErrors) {
  const reserveDate = new Date(
      `${formData.reservation_date} ${formData.reservation_time} GMT-0500`
    ),
    start = new Date(`${formData.reservation_date} 10:30:00 GMT-0500`),
    end = new Date(`${formData.reservation_date} 21:30:00 GMT-0500`);

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

  if (
    reserveDate.getTime() < start.getTime() ||
    reserveDate.getTime() > end.getTime()
  ) {
    foundErrors.push({
      message: "Reservations cannot be made outside of 10:30am to 9:30pm.",
    });
  }

  setDateErrors(foundErrors);

  if (foundErrors.length > 0) {
    return false;
  }
  // if we get here, our reservation date is valid!
  return true;
}
