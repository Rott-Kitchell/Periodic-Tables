import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import { next, today } from "../utils/date-time";

export default function AddEditRes({ setSingleRes, singleRes }) {
  const history = useHistory();
  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: next(today()),
    reservation_time: "12:00:00",
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
      .then(history.push(`/dashboard?date=${formData.reservation_date}`))
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <h2>New Reservation</h2>
      <form onSubmit={handleSubmit}>
        <label className="form-label" htmlFor="first_name">
          First name:&nbsp;
        </label>
        <input
          className="form-control"
          onChange={handleChange}
          id="first_name"
          name="first_name"
          value={formData.first_name}
        />
        <label className="form-label" htmlFor="last_name">
          Last name:&nbsp;
        </label>
        <input
          className="form-control"
          onChange={handleChange}
          id="last_name"
          name="last_name"
          value={formData.last_name}
        />
        <label className="form-label" htmlFor="mobile_number">
          Mobile number:&nbsp;
        </label>
        <input
          onChange={handleChange}
          name="mobile_number"
          value={formData.mobile_number}
        />
        <label className="form-label" htmlFor="reservation_date">
          Date of reservation:&nbsp;
        </label>
        <input
          onChange={handleChange}
          type="date"
          name="reservation_date"
          value={formData.reservation_date}
        />
        <label className="form-label" htmlFor="reservation_time">
          Time of reservation:&nbsp;
        </label>
        <input
          onChange={handleChange}
          type="time"
          name="reservation_time"
          value={formData.reservation_time}
        />
        <label className="form-label" htmlFor="people">
          Number of people:&nbsp;
        </label>
        <input onChange={handleChange} type="integer" min="1" name="people" />
        <br />
        <button className="btn btn-secondary" onClick={history.goBack}>
          Cancel
        </button>
        <button className="btn btn-primary" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}
