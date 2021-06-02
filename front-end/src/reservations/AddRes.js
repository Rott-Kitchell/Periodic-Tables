import { useState } from "react";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation } from "../utils/api";
import ResForm from "./ResForm";
import validateDate from "./validateDate";

export default function AddRes({ reservations, setReservations }) {
  const history = useHistory();
  const [errorAlerts, setErrorAlerts] = useState([]);

  let handleSubmit = (res) => {
    const abortController = new AbortController();
    setErrorAlerts([]);
    if (validateDate(res, setErrorAlerts)) {
      createReservation(res, abortController.signal)
        .then(history.push(`/dashboard?date=${res.reservation_date}`))
        .catch(setErrorAlerts);
    }
    return () => abortController.abort();
  };

  function handleCancel() {
    history.goBack();
  }

  let errors;
  if (errorAlerts.length >= 1) {
    errors = errorAlerts.map((error, i) => {
      return (
        <div key={i}>
          <ErrorAlert error={error} />
        </div>
      );
    });
  }

  return (
    <main>
      <h1 className="text-center">Create Reservation</h1>
      {errors}
      <ResForm handleSubmit={handleSubmit} handleCancel={handleCancel} />
    </main>
  );
}
