import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { readReservation, updateReservation } from "../utils/api";
import formatReservationTime from "../utils/format-reservation-time";
import ResForm from "./ResForm";
import validateDate from "./validateDate";

export default function EditRes({ loadDashboard }) {
  const history = useHistory();
  const { reservation_id } = useParams();

  const [reservation, setReservation] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    readReservation(reservation_id, abortController.signal)
      .then(setReservation)
      .catch(setError);
    return () => abortController.abort();
  }, [reservation_id]);

  function handleSubmit(updatedRes) {
    if (validateDate(updatedRes, setError)) {
      updateReservation(formatReservationTime(updatedRes))
        .then(loadDashboard)
        .then(() => history.push(`/dashboard`))
        .catch((e) => {
          console.log(e);
          setError(e);
        });
    }
  }

  function cancelHandler() {
    history.goBack(-1);
  }

  const child = reservation.reservation_id ? (
    <ResForm
      initialState={{ ...reservation }}
      handleCancel={cancelHandler}
      handleSubmit={handleSubmit}
    />
  ) : (
    <p>Loading...</p>
  );
  return (
    <main>
      <h1>Edit Reservation</h1>
      <ErrorAlert error={error} />
      {child}
    </main>
  );
}
