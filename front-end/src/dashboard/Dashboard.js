import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom";
import { next, today, previous } from "../utils/date-time";
import ResList from "./ResList";
import TableList from "./TableList";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date, tables, reservations, setReservations, setTables }) {
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);
  const history = useHistory();

  useEffect(loadDashboard, [date, setReservations, setTables]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    setTablesError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .then(() => listTables(abortController.signal))
      .then(setTables)
      .catch(setTablesError);

    return () => abortController.abort();
  }

  return (
    <main>
      <h1 className="text-center">Dashboard</h1>
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />
      <div className="row">
        <div className="col">
          <h4 className="mb-0 text-center">Reservations for {date}</h4>
          <div className="text-center">
            <div
              className="btn-group btn-group-lg"
              role="group"
              aria-label="Basic example"
            ></div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => history.push(`/dashboard?date=${previous(date)}`)}
            >
              Previous
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => history.push(`/dashboard?date=${today()}`)}
            >
              Today
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => history.push(`/dashboard?date=${next(date)}`)}
            >
              Next
            </button>
          </div>
          <ResList reservations={reservations} />
        </div>
        <div className="col">
          <h4 className="mb-0 text-center">Tables</h4>
          <TableList tables={tables} />
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
