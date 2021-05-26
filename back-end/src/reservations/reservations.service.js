const knex = require("../db/connection");

function list() {
  return knex("reservations")
    .select("*")
    .orderBy(["reservation_date", "reservation_time"]);
}

function listByDate(reservation_date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date })
    .whereNot({ status: "finished" })
    .orderBy("reservation_time");
}

function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function read(reservation_id) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservation_id })
    .first();
}

function update(updatedRes) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: updatedRes.reservation_id })
    .update(updatedRes, "*")
    .then((updatedRecords) => updatedRecords[0]);
}

module.exports = {
  list,
  listByDate,
  create,
  read,
  update,
};
