const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reservationValidator = require("../util/reservationValidator");
const reservationsService = require("./reservations.service");

async function reservationExists(req, res, next) {
  const { reservationId } = req.params;
  const reservation = await reservationsService.read(reservationId);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  return next({
    status: 404,
    message: `Reservation ${reservationId} cannot be found.`,
  });
}

function hasValidFields(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = reservationValidator(data);

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid reservation field(s): ${invalidFields.join(", ")}`,
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

  if (data.status && data.status !== "booked") {
    return next({
      status: 400,
      message: `Status cannot be ${data.status}`,
    });
  }

  next();
}

async function list(req, res, next) {
  const reservationDate = req.query.date;
  const data = reservationDate
    ? await reservationsService.listByDate(reservationDate)
    : await reservationsService.search(req.query.mobile_number);

  res.json({ data });
}

async function create(req, res, next) {
  let reservation = req.body.data;
  const data = await reservationsService.create(reservation);
  res.status(201).json({ data });
}

async function read(req, res, next) {
  const { reservation } = res.locals;
  res.json({ data: reservation });
}

async function updateStatus(req, res, next) {
  const {
    data: { status },
  } = req.body;
  const { reservation } = res.locals;
  if (reservation.status === "finished") {
    return next({
      status: 400,
      message: `a finished reservation cannot be updated`,
    });
  }

  if (!["booked", "seated", "finished", "cancelled"].includes(status)) {
    return next({
      status: 400,
      message: `Status cannot be ${status}`,
    });
  }

  const updatedRes = {
    ...reservation,
    status: status,
  };

  const newData = await reservationsService.update(updatedRes);

  res.status(200).json({ data: newData });
}

async function update(req, res, next) {
  const { data } = req.body;
  const { reservation } = res.locals;

  const updatedRes = {
    ...reservation,
    ...data,
  };

  const newData = await reservationsService.update(updatedRes);

  res.status(200).json({ data: newData });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [asyncErrorBoundary(hasValidFields), asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(reservationExists), read],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(updateStatus),
  ],
  update: [
    asyncErrorBoundary(hasValidFields),
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(update),
  ],
};
