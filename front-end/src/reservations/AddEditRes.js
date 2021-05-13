import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import { next, today } from "../utils/date-time";

function AddEditRes({ setReservations, setSingleRes, singleRes }) {
  const history = useHistory();
  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    date_of_reservation: next(today()),
    time_of_reservation: "12:00:00",
    people: 1,
  };
  const [formData, setFormData] = useState(initialFormState);

  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  let handleSubmit = (event) => {
    event.preventDefault();

    createReservation(formData)
      .then(setFormData({ ...initialFormState }))
      .then(
        setSingleRes((origRes) => {
          return { ...origRes, formData };
        })
      )
      //.then(history.push(`/`))
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <h2>New Reservation</h2>
      <form onSubmit={handleSubmit}>
        <label className="form-label" htmlFor="first_name">
          First name:
        </label>
        <input
          className="form-control"
          onChange={handleChange}
          id="first_name"
          name="first_name"
        />
        <label className="form-label" htmlFor="last_name">
          Last name:
        </label>
        <input
          className="form-control"
          onChange={handleChange}
          id="last_name"
          name="last_name"
        />
        <label className="form-label" htmlFor="mobile_number">
          Mobile number:
        </label>
        <input onChange={handleChange} name="mobile_number" />
        <label className="form-label" htmlFor="date_of_reservation">
          Date of reservation:
        </label>
        <input onChange={handleChange} type="date" name="date_of_reservation" />
        <label className="form-label" htmlFor="time_of_reservation">
          Time of reservation:
        </label>
        <input onChange={handleChange} type="time" name="time_of_reservation" />
        <label className="form-label" htmlFor="people">
          Number of people:
        </label>
        <input onChange={handleChange} type="integer" min="1" name="people" />
        <br />
        <Link className="btn btn-secondary" to="/">
          Cancel
        </Link>
        <button className="btn btn-primary" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

export default AddEditRes;
