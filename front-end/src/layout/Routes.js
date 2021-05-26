import React, { useState, useEffect } from "react";
import useQuery from "../utils/useQuery";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import AddEditRes from "../reservations/AddEditRes";
import AddEditTable from "../tables/AddEditTable";
import Seat from "../reservations/Seat";
import { listReservations, listTables } from "../utils/api";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const query = useQuery();
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);
  const [reservations, setReservations] = useState();
  const [tables, setTables] = useState();
  const [date, setDate] = useState();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(loadDashboard, [date]);

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

  useEffect(() => {
    if (query.get("date")) {
      setDate(query.get("date"));
    } else {
      setDate(today());
    }
  }, [query]);

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/seat">
        <Seat
          tables={tables}
          reservations={reservations}
          setTables={setTables}
          loadDashboard={loadDashboard}
        />
      </Route>
      <Route exact={true} path="/reservations/new">
        <AddEditRes />
      </Route>
      <Route exact={true} path="/tables/new">
        <AddEditTable />
      </Route>
      <Route path="/dashboard">
        <Dashboard
          date={date}
          tables={tables}
          reservations={reservations}
          setReservations={setReservations}
          setTables={setTables}
          tablesError={tablesError}
          reservationsError={reservationsError}
          loadDashboard={loadDashboard}
        />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
