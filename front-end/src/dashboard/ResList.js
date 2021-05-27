import { Fragment } from "react";
import { Link } from "react-router-dom";

export default function ResList({ reservations }) {
  if (reservations) {
    return reservations.map((res) => {
      const {
        reservation_id,
        mobile_number,
        reservation_date,
        reservation_time,
        people,
        first_name,
        last_name,
        status,
      } = res;
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
                data-reservation-id-status={reservation_id}
                className="list-group-item"
              >
                Status: {status}
              </li>
            </ul>

            {status === "booked" ? (
              <Link
                to={`/reservations/${reservation_id}/seat`}
                className="btn btn-primary mt-2"
              >
                Seat
              </Link>
            ) : (
              <Fragment />
            )}
          </div>
        </div>
      );
    });
  } else {
    return <div>No reservations found</div>;
  }
}
