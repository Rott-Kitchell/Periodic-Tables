const knex = require("../db/connection");

function read(tableId) {
  return knex("tables as t").where({ table_id: tableId }).first();
}

function list() {
  return knex("tables").select("*").orderBy("table_name", "asc");
}

function update(updatedTable) {
  return knex("tables")
    .select("*")
    .where({ table_id: updatedTable.table_id })
    .update(updatedTable, "*")
    .then((updatedRecords) => updatedRecords[0]);
}

function create(table) {
  return knex("tables")
    .insert(table)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

module.exports = { read, update, list, create };
