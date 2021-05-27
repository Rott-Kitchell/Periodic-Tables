import React, { useState } from "react";
import formatPhoneNumber from "../utils/phoneNumberFormatter";

export default function ResForm({
  handleSubmit,
  handleCancel,
  initialState = {
    first_name: "",
    last_name: "",
    mobile_number: "123-456-7890",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  },
}) {
  const [formData, setFormData] = useState(initialState);

  let handleChange = ({ target }) => {
    if (target.name === "people") {
      setFormData({
        ...formData,
        [target.name]: Number(target.value),
      });
    } else {
      setFormData({
        ...formData,
        [target.name]: target.value,
      });
    }
  };

  let phoneNumberFormatter = ({ target }) => {
    const formattedInputValue = formatPhoneNumber(target.value);
    setFormData({
      ...formData,
      mobile_number: formattedInputValue,
    });
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(formData);
        }}
      >
        <label className="form-label" htmlFor="first_name">
          First name:&nbsp;
        </label>
        <input
          className="form-control"
          onChange={handleChange}
          id="first_name"
          name="first_name"
          value={formData.first_name}
          placeholder={formData.first_name}
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
          placeholder={formData.last_name}
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
          placeholder={formData.mobile_number}
          pattern="([0-9]{3}-)?[0-9]{3}-[0-9]{4}"
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
          placeholder={formData.reservation_date}
          required={true}
        />
        <label className="form-label" htmlFor="reservation_time">
          Time of reservation:&nbsp;
        </label>
        <input
          type="time"
          pattern="[0-9]{2}:[0-9]{2}"
          onChange={handleChange}
          name="reservation_time"
          id="reservation_time"
          value={formData.reservation_time}
          placeholder={formData.reservation_time}
          required={true}
        />
        <label className="form-label" htmlFor="people">
          Number of people:&nbsp;
        </label>
        <input
          onChange={handleChange}
          type="number"
          min={1}
          name="people"
          id="people"
          value={formData.people}
          placeholder={formData.people}
          required={true}
        />
        <br />
        <button
          className="btn btn-secondary"
          onClick={handleCancel}
          type="cancel"
        >
          Cancel
        </button>
        <button className="btn btn-primary" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}
