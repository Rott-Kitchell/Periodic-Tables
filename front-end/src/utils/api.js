/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Retrieves all existing reservation.
 *
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */

export async function listReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) => {
    return url.searchParams.append(key, value.toString());
  });
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

/**
 * Saves reservation to the database.
 
 * @param data
 *  the deck to save, which must not have an `id` property
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<reservartion>}
 *  a promise that resolves the saved reservation, which will now have an `id` property and the status "booked".
 */
export async function createReservation(data, signal) {
  const url = `${API_BASE_URL}/reservations`;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data }),
    signal,
  };
  return await fetchJson(url, options);
}

/**
 * Retrieves all existing tables
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<[table]>}
 *  a promise that resolves to a possibly empty array of tables saved in the database.
 */
export async function listTables(signal) {
  const url = new URL(`${API_BASE_URL}/tables`);
  return await fetchJson(url, { headers, signal }, []);
}

/**
 * Updates an existing table by attaching a reservation to it and changing the reservation's status to
 * "seated"
 * @param table_id
 *  the table to save, which must have an `id` property.
 * @param data
 *  the "reservation_id" to attach to the table
 * @returns {Promise<Error|*>}
 *  a promise that resolves to the updated table.
 */

export async function seatResAtTable(table_id, data) {
  const url = `${API_BASE_URL}/tables/${table_id}/seat`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: { reservation_id: data } }),
  };
  return await fetchJson(url, options, {});
}

/**
 * Creates a new table.
 * @param data
 *  the table to create, which must not have an `id` property
 * @returns {Promise<Error|*>}
 *  a promise that resolves to the new table, which will have an `id` property.
 */
export async function createTable(data, signal) {
  // There is a bug in json-server, if you post to /decks/:deckId/cards the associated deckId is a string
  // and the card is not related to the deck because the data types of the ID's are different.
  const url = `${API_BASE_URL}/tables`;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data }),
    signal,
  };
  return await fetchJson(url, options);
}

/**
 * Retrieves the reservation with the specified `reservationId`
 * @param reservationId
 *  the id of the target
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<Error|*>}
 *  a promise that resolves to the saved reservation.
 */
export async function readReservation(reservationId, signal) {
  console.log(reservationId);
  const url = `${API_BASE_URL}/reservations/${reservationId}`;
  return await fetchJson(url, { signal })
    .then(formatReservationDate)
    .then(formatReservationTime);
}

/**
 * Removes the "reservation_id" from the specified `table_id`. Since we already have a PUT method in seatResAtTAble, we are using a DELETE with this one
 * @param table_id
 *  the id of the table to free up
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<Error|*>}
 *  a promise that resolves to an empty object.
 */
export async function freeUpTable(table_id, signal) {
  const url = `${API_BASE_URL}/tables/${table_id}/seat`;
  const options = { method: "DELETE", signal };
  return await fetchJson(url, options);
}

/**
 * Updates the status of a reservation
 * @param reservation_id
 *  the id of the reservation to update
 * @param data
 *  the new status
 * @param signal
 * optional AbortController.signal
 * @returns {Promise<Error|*>}
 *  a promise that resolves to the updated reservation.
 */

export async function changeReservationStatus(reservation_id, data, signal) {
  const url = `${API_BASE_URL}/reservations/${reservation_id}/status`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: { status: data } }),
    signal,
  };
  return await fetchJson(url, options, {})
    .then(formatReservationDate)
    .then(formatReservationTime);
}

/**
 * Updates a existing reservation
 *  @param data
 *  the information of the reservation to update, which must have an `id` property
 * @returns {Promise<[signal]>}
 *  a promise that resolves to the updated reservation.
 */
export async function updateReservation(data, signal) {
  const url = `${API_BASE_URL}/reservations/${data.reservation_id}`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data }),
    signal,
  };
  return await fetchJson(url, options)
    .then(formatReservationDate)
    .then(formatReservationTime);
}
