const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reservationValidator = require("../util/reservationValidator");
const reservationsService = require("./reservations.service");
/**
 * List handler for reservation resources
 */
const validFields = new Set([
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
]);

function hasValidFields(req, res, next) {
  const { data = {} } = req.body;
  const invalidFields = reservationValidator(data, validFields);
  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  const reserveDate = new Date(
      `${data.reservation_date} ${data.reservation_time} GMT-0500`
    ),
    start = new Date(`${data.reservation_date} 10:30:00 GMT-0500`),
    end = new Date(`${data.reservation_date} 21:30:00 GMT-0500`);

  const todaysDate = new Date();

  if (reserveDate.getDay() === 2) {
    return next({
      status: 400,
      message:
        "Reservations cannot be made on a Tuesday (Restaurant is closed).",
    });
  }
  if (reserveDate < todaysDate) {
    return next({
      status: 400,
      message: "Reservations must be made in the future.",
    });
  }
  if (
    reserveDate.getTime() < start.getTime() ||
    reserveDate.getTime() > end.getTime()
  ) {
    return next({
      status: 400,
      message: "Reservations cannot be made outside of 10:30am to 9:30pm.",
    });
  }

  next();
}

async function list(req, res, next) {
  const reservationDate = req.query.date;
  const data = reservationDate
    ? await reservationsService.listByDate(reservationDate)
    : await reservationsService.list();
  res.json({ data });
}

async function create(req, res, next) {
  let reservation = req.body.data;
  const data = await reservationsService.create(reservation);
  res.status(201).json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [hasValidFields, asyncErrorBoundary(create)],
};
