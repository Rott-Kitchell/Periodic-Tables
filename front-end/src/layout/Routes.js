import React, { useState } from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import AddEditRes from "../reservations/AddEditRes";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const [reservations, setReservations] = useState();
  const [singleRes, setSingleRes] = useState();
  const [date, setDate] = useState(today());
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations/new">
        <AddEditRes
          setReservations={setReservations}
          setSingleRes={setSingleRes}
          singleRes={singleRes}
        />
      </Route>
      <Route path="/dashboard">
        <Dashboard
          date={date}
          reservations={reservations}
          setReservations={setReservations}
        />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
