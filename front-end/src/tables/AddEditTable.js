import { useState } from "react";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";

export default function AddEditTable({ setTables }) {
  const [error, setError] = useState(null);
  const history = useHistory();
  const initialFormState = {
    table_name: "",
    capacity: 1,
  };
  const [formData, setFormData] = useState(initialFormState);

  let handleChange = ({ target }) => {
    if (target.name === "capacity") {
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

  let handleSubmit = (event) => {
    event.preventDefault();

    setTables(formData)
      .then(setFormData({ ...initialFormState }))
      .then(history.push(`/dashboard`))
      .catch(setError);
  };

  return (
    <div>
      <h2>New Table</h2>
      <ErrorAlert error={error} />
      <form onSubmit={handleSubmit}>
        <label className="form-label" htmlFor="table_name">
          Table Name:&nbsp;
        </label>
        <input
          className="form-control"
          onChange={handleChange}
          id="table_name"
          name="table_name"
          value={formData.table_name}
          required={true}
        />
        <label className="form-label" htmlFor="people">
          Capacity:&nbsp;
        </label>
        <input
          onChange={handleChange}
          type="number"
          min={1}
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
        </button>
      </form>
    </div>
  );
}
