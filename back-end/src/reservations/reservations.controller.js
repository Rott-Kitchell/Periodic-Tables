const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reservationsService = require("./reservations.service");
/**
 * List handler for reservation resources
 */
async function list(req, res, next) {
  const reservationDate = req.query.date;
  console.log(reservationDate, "resdate");
  const data = reservationDate
    ? await reservationsService.listByDate(reservationDate)
    : await reservationsService.list();
  res.json({ data });
}

async function create(req, res, next) {
  let reservation = req.body.data;
  console.log(reservation, "create");
  const data = await reservationsService.create(reservation);
  res.status(201).json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: asyncErrorBoundary(create),
};
