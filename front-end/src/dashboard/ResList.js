import { Fragment } from "react";
import { Link } from "react-router-dom";

export default function ResList({ reservations, handleCancel }) {
  if (reservations) {
    return reservations.map((reservation) => {
      const {
        reservation_id,
        mobile_number,
        reservation_date,
        reservation_time,
        people,
        first_name,
        last_name,
        status,
      } = reservation;
      return (
        <div className="card mb-1" key={reservation_id} id={reservation_id}>
          <div className="card-body">
            <div className="text-center">
              <h5 className="d-inline-block card-title">{last_name}</h5>
              {", "}
              <h6 className="d-inline-block card-subtitle text-muted">
                {first_name}
              </h6>
            </div>
            <ul className="list-group list-group">
              <li className="list-group-item">Contact: {mobile_number}</li>
              <li className="list-group-item">Party size: {people}</li>
              <li className="list-group-item">Date: {reservation_date}</li>
              <li className="list-group-item">Time: {reservation_time}</li>
              <li
                data-reservation-id-status={reservation.reservation_id}
                className="list-group-item"
              >
                Status: {status}
              </li>
            </ul>
            <div className="justify-content-between">
              {status === "booked" ? (
                <div>
                  <Link
                    to={`/reservations/${reservation_id}/seat`}
                    className="btn btn-primary mt-2"
                  >
                    Seat
                  </Link>
                  <Link
                    to={`/reservations/${reservation_id}/edit`}
                    className="btn btn-primary mt-2"
                  >
                    Edit
                  </Link>
                </div>
              ) : (
                <Fragment />
              )}

              <button
                hidden={status !== "booked"}
                className="btn btn-secondary"
                data-reservation-id-cancel={reservation.reservation_id}
                onClick={(e) => {
                  e.preventDefault();
                  handleCancel(reservation_id);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      );
    });
  } else {
    return <div>No reservations found</div>;
  }
}
