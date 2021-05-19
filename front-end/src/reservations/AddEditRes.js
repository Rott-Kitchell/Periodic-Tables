import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation } from "../utils/api";
import formatPhoneNumber from "../utils/phoneNumberFormatter";
import validateDate from "./validateDate";

export default function AddEditRes({ setSingleRes, singleRes }) {
  const [error, setError] = useState(null);
  const [dateErrors, setDateErrors] = useState([]);
  const history = useHistory();
  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
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

    if (validateDate(formData, setDateErrors)) {
      createReservation(formData)
        .then(setFormData({ ...initialFormState }))
        .then(history.push(`/dashboard?date=${formData.reservation_date}`))
        .catch(setError);
    }
  };

  const errors = () => {
    return dateErrors.map((dateerror, idx) => (
      <ErrorAlert key={idx} error={dateerror} />
    ));
  };

  let phoneNumberFormatter = ({ target }) => {
    console.log(target);
    const formattedInputValue = formatPhoneNumber(target.value);
    setFormData({
      ...formData,
      mobile_number: formattedInputValue,
    });
  };

  return (
    <div>
      <h2>New Reservation</h2>
      <ErrorAlert error={error} />
      {errors()}
      <form onSubmit={handleSubmit}>
        {/* <label className="form-label" htmlFor="first_name">
          First name:&nbsp;
        </label>
        <input
          className="form-control"
          onChange={handleChange}
          id="first_name"
          name="first_name"
          value={formData.first_name}
          required={true}
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
          required={true}
        />
        <label className="form-label" htmlFor="mobile_number">
          Mobile number:&nbsp;
        </label>
        <input
          type="tel"
          onChange={phoneNumberFormatter}
          name="mobile_number"
          id="mobile_number"
          value={formData.mobile_number}
          placeholder="123-456-7890"
          pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
          required={true}
        />
        <label className="form-label" htmlFor="reservation_date">
          Date of reservation:&nbsp;
        </label>
        <input
          onChange={handleChange}
          type="date"
          pattern="\d{4}-\d{2}-\d{2}"
          name="reservation_date"
          id="reservation_date"
          value={formData.reservation_date}
          required={true}
        />
        <label className="form-label" htmlFor="reservation_time">
          Time of reservation:&nbsp;
        </label>
        <input
          input
          type="time"
          pattern="[0-9]{2}:[0-9]{2}"
          onChange={handleChange}
          name="reservation_time"
          id="reservation_time"
          value={formData.reservation_time}
          required={true}
        />
        <label className="form-label" htmlFor="people">
          Number of people:&nbsp;
        </label>
        <input
          onChange={handleChange}
          type="number"
          min="1"
          name="people"
          id="people"
          value={formData.people}
          required={true}
        />
        <br />
        <button className="btn btn-secondary" onClick={history.goBack}>
          Cancel
        </button>
        <button className="btn btn-primary" type="submit">
          Submit
        </button> */}
      </form>
    </div>
  );
}
