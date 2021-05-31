import React, { useState, useEffect } from "react";
import useQuery from "../utils/useQuery";
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import AddEditTable from "../tables/AddEditTable";
import Seat from "../reservations/Seat";
import {
  changeReservationStatus,
  listReservations,
  listTables,
} from "../utils/api";
import Search from "../search/Search";
import AddRes from "../reservations/AddRes";
import EditRes from "../reservations/EditRes";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const history = useHistory();
  const query = useQuery();
  const location = useLocation();
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [date, setDate] = useState("");

  // useEffect(() => {
  //   setDate("");
  //   if (query.get("date")) {
  //     setDate(query.get("date"));
  //   } else {
  //     if (location.pathname === "/dashboard")
  //       history.push(`/dashboard?date=${today()}`);
  //   }
  // }, [query, history, location.pathname]);

  useEffect(() => {
    setDate("");
    if (query.get("date")) {
      setDate(query.get("date"));
    } else {
      if (location.pathname === "/dashboard")
        history.push(`/dashboard?date=${today()}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    function loadDashboard() {
      const abortController = new AbortController();
      setReservationsError(null);
      setTablesError(null);
      listReservations({ date }, abortController.signal)
        .then(setReservations)
        .catch(setReservationsError);

      listTables(abortController.signal).then(setTables).catch(setTablesError);

      return () => abortController.abort();
    }
    if (date) loadDashboard();
  }, [date, location.pathname]);

  function handleCancel(reservation_id) {
    const abortController = new AbortController();
    let result = window.confirm(
      "Do you want to cancel this reservation? \n \n This cannot be undone."
    );
    if (result)
      changeReservationStatus(
        reservation_id,
        "cancelled",
        abortController.signal
      )
        .then(() => window.location.reload())
        .catch(setReservationsError);

    return () => abortController.abort();
  }

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/edit">
        <EditRes
          reservations={reservations}
          setReservations={setReservations}
        />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/seat">
        <Seat
          tables={tables}
          reservations={reservations}
          setTables={setTables}
          setReservations={setReservations}
        />
      </Route>
      <Route exact={true} path="/reservations/new">
        <AddRes reservations={reservations} setReservations={setReservations} />
      </Route>
      <Route exact={true} path="/search">
        <Search />
      </Route>
      <Route exact={true} path="/tables/new">
        <AddEditTable tables={tables} setTables={setTables} />
      </Route>
      <Route path="/dashboard">
        <Dashboard
          date={date}
          tables={tables}
          reservations={reservations}
          tablesError={tablesError}
          reservationsError={reservationsError}
          handleCancel={handleCancel}
        />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
