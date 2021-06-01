import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom";
import { next, today, previous } from "../utils/date-time";
import ResList from "./ResList";
import TableList from "./TableList";
import { Fragment } from "react";

function Dashboard({
  date,
  tables,
  reservations,
  tablesError,
  reservationsError,
  loadDashboard,
  handleCancel,
}) {
  const history = useHistory();

  return (
    <main>
      <h1 className="text-center">Dashboard</h1>
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />
      <div className="row">
        <div className="col-md-6 col-sm-12">
          <h4 className="mb-1 text-center">Reservations for {date}</h4>
          <div className="text-center mb-1">
            <div
              className="btn-group btn-group"
              role="group"
              aria-label="Date Buttons"
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
          <div className="row row-col-1 row-col-xl-2">
            {reservations ? (
              <ResList
                reservations={reservations.filter(
                  (res) => res.status !== "cancelled"
                )}
                handleCancel={handleCancel}
              />
            ) : (
              <Fragment />
            )}
          </div>
        </div>
        <div className="col-md-6  col-sm-12">
          <h4 className="mb-1 text-center">Tables</h4>
          <div className="row row-col-1 row-col-xl-2">
            <TableList tables={tables} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
