const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const tableValidator = require("../util/tableValidator");
const tablesService = require("./tables.service");
const reservationsService = require("../reservations/reservations.service");

const validFields = new Set(["table_name", "capacity"]);

async function tableExists(req, res, next) {
  const { tableId } = req.params;
  const table = await tablesService.read(Number(tableId));

  if (table) {
    res.locals.table = table;
    return next();
  } else {
    next({ status: 404, message: "Table cannot be found." });
  }
}

function hasValidFieldsCreate(req, res, next) {
  const { data = {} } = req.body;
  console.log(req.body);
  const invalidFields = tableValidator(data, validFields);
  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

async function update(req, res, next) {
  console.log(req.body);
  let { table } = res.locals;
  if (!req.body.data || !req.body.data.reservation_id) {
    return next({
      status: 400,
      message: `No reservation_id/data`,
    });
  }
  const reservation = await reservationsService.read(
    req.body.data.reservation_id
  );
  if (!reservation) {
    return next({
      status: 404,
      message: `Reservation ${req.body.data.reservation_id} does not exist`,
    });
  }
  if (table.reservation_id !== null) {
    return next({
      status: 400,
      message: `Table occupied`,
    });
  }

  if (reservation.people > table.capacity) {
    return next({
      status: 400,
      message: `Table does not have the capacity`,
    });
  }

  const updatedTable = {
    ...table,
    ...req.body.data,
  };

  const newData = await tablesService.update(updatedTable);
  res.json({ data: newData });
}

async function list(req, res, next) {
  const data = await tablesService.list();
  res.json({ data });
}
async function create(req, res) {
  const data = await tablesService.create(req.body.data);

  res.status(201).json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  update: [asyncErrorBoundary(tableExists), asyncErrorBoundary(update)],
  create: [
    asyncErrorBoundary(hasValidFieldsCreate),
    asyncErrorBoundary(create),
  ],
};
