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
      let statusColor;
      if (status === "booked") {
        statusColor = "text-success";
      } else if (status === "cancelled") {
        statusColor = "text-danger";
      } else if (status === "seated") {
        statusColor = "text-warning";
      }
      return (
        <div className="col-lg-6 p-0" key={reservation_id}>
          <div className="card border-dark" id={reservation_id}>
            <div className="card-body p-2">
              <div className="text-center">
                <h5 className="d-inline-block card-title">{last_name}</h5>
                {", "}
                <h6 className="d-inline-block card-subtitle text-muted">
                  {first_name}
                </h6>
              </div>
              <ul className="list-group">
                <li className="list-group-item">Contact: {mobile_number}</li>
                <li className="list-group-item">Party size: {people}</li>
                <li className="list-group-item">Date: {reservation_date}</li>
                <li className="list-group-item">Time: {reservation_time}</li>
                <li
                  data-reservation-id-status={reservation.reservation_id}
                  className="list-group-item"
                >
                  Status:{" "}
                  <div className={`d-inline ${statusColor}`}>{status}</div>
                </li>
              </ul>
              <div
                className="btn-toolbar justify-content-between"
                role="toolbar"
              >
                {status === "booked" ? (
                  <div className="btn-group">
                    <Link
                      to={`/reservations/${reservation_id}/seat`}
                      className="btn btn-primary btn-sm"
                    >
                      Seat
                    </Link>
                    <Link
                      to={`/reservations/${reservation_id}/edit`}
                      className="btn btn-primary btn-sm"
                    >
                      Edit
                    </Link>
                  </div>
                ) : (
                  <Fragment />
                )}
                <div className="btn-group">
                  <div className="btn-group-prepend">
                    <button
                      hidden={status !== "booked"}
                      className="btn btn-danger btn-sm"
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
            </div>
          </div>
        </div>
      );
    });
  } else {
    return <div>No reservations found</div>;
  }
}
