import { useState } from "react";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation } from "../utils/api";
import ResForm from "./ResForm";
import validateDate from "./validateDate";

export default function AddRes({ loadDashboard }) {
  const history = useHistory();
  const [error, setError] = useState(null);
  let handleSubmit = (res) => {
    if (validateDate(res, setError)) {
      const abortController = new AbortController();
      createReservation(res)
        .then(loadDashboard)
        .then(history.push(`/dashboard?date=${res.reservation_date}`))
        .catch(setError);
      return () => abortController.abort();
    }
  };

  function handleCancel() {
    history.goBack(-1);
  }

  return (
    <main>
      <h1>Create Reservation</h1>
      <ErrorAlert error={error} />
      <ResForm
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
        loadDashboard={loadDashboard}
      />
    </main>
  );
}
