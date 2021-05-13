import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date, reservations, setReservations }) {
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [date, setReservations]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
      </div>
      <div class="btn-group" role="group" aria-label="Basic example">
        <button type="button" className="btn btn-primary">
          Previous
        </button>
        <button type="button" className="btn btn-primary">
          Today
        </button>
        <button type="button" className="btn btn-primary">
          Next
        </button>
      </div>
      <ErrorAlert error={reservationsError} />
      {JSON.stringify(reservations)}
    </main>
  );
}

export default Dashboard;
