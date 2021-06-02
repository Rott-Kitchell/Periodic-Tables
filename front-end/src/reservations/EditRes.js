import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { readReservation, updateReservation } from "../utils/api";
import formatReservationTime from "../utils/format-reservation-time";
import ResForm from "./ResForm";
import validateDate from "./validateDate";

export default function EditRes({ reservations, setReservations }) {
  const history = useHistory();
  const { reservation_id } = useParams();

  const [reservation, setReservation] = useState({});
  const [errorAlerts, setErrorAlerts] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    readReservation(reservation_id, abortController.signal)
      .then(setReservation)
      .catch(setErrorAlerts);
    return () => abortController.abort();
  }, [reservation_id]);

  function handleSubmit(updatedRes) {
    const abortController = new AbortController();
    setErrorAlerts([]);
    if (validateDate(updatedRes, setErrorAlerts)) {
      updateReservation(
        formatReservationTime(updatedRes),
        abortController.signal
      )
        .then(() =>
          history.push(`/dashboard?date=${updatedRes.reservation_date}`)
        )
        .catch((e) => {
          setErrorAlerts(e);
        });
      return () => abortController.abort();
    }
  }

  function cancelHandler() {
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
      <h1 className="text-center">Edit Reservation</h1>
      {errors}
      {child}
    </main>
  );
}
