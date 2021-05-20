const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const tableValidator = require("../util/tableValidator");
const tablesService = require("./tables.service");

const validFields = new Set(["table_name", "capacity"]);

async function tableExists(req, res, next) {
  const { tableId } = req.params;

  const table = await tablesService.read(tableId);
  console.log(table, typeof tableId);
  if (table) {
    res.locals.table = table;
    return next();
  } else {
    next({ status: 404, message: "Table cannot be found." });
  }
}

function hasValidFields(req, res, next) {
  const { data = {} } = req.body;
  const invalidFields = tableValidator(data, validFields);
  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  if (people > capacity) {
    return next({ status: 400, message: "Table is too small." });
  }
  if (reservation_id) {
    return next({ status: 400, message: "Table already occupied." });
  }
  next();
}

async function update(req, res) {
  const updatedTable = {
    ...req.body.data,
    review_id: res.locals.table.table_id,
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
  create: [asyncErrorBoundary(hasValidFields), asyncErrorBoundary(create)],
};
