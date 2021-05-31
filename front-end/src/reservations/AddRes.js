import { useState } from "react";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation } from "../utils/api";
import ResForm from "./ResForm";
import validateDate from "./validateDate";

export default function AddRes({ reservations, setReservations }) {
  const history = useHistory();
  const [error, setError] = useState(null);
  let handleSubmit = (res) => {
    const abortController = new AbortController();
    if (validateDate(res, setError)) {
      createReservation(res)
        .then(history.push(`/dashboard?date=${res.reservation_date}`))
        .catch(setError);
    }
    return () => abortController.abort();
  };

  function handleCancel() {
    history.goBack();
  }

  return (
    <main>
      <h1>Create Reservation</h1>
      <ErrorAlert error={error} />
      <ResForm handleSubmit={handleSubmit} handleCancel={handleCancel} />
    </main>
  );
}
