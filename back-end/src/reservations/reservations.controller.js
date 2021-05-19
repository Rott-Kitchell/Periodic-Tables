const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
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
  const dataKeys = Object.keys(data);
  const dataValues = Object.values(data);
  console.log(dataValues.includes(""));
  if (!dataKeys || dataValues.includes("")) {
    return next({
      status: 400,
      message: `No/Incomplete data`,
    });
  }

  const invalidFields = dataKeys.filter((field) => !validFields.has(field));

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  const missingFields = [];
  validFields.forEach((field) => {
    if (!dataKeys.includes(field)) {
      missingFields.push(field);
    }
  });
  if (missingFields.length)
    return next({
      status: 400,
      message: `Missing field(s): ${missingFields.join(", ")}`,
    });

  if (Number(data.people) <= 0 || isNaN(data.people))
    return next({
      status: 400,
      message: `Party size must be 1 or more`,
    });

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
