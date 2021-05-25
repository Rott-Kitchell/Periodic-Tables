import { useState } from "react";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";
import validateTable from "./validateTable";

export default function AddEditTable({ setTables }) {
  const [error, setError] = useState(null);
  const [tableErrors, setTableErrors] = useState([]);
  const history = useHistory();
  const initialFormState = {
    table_name: "",
    capacity: "",
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
    if (validateTable(formData, setTableErrors))
      createTable(formData)
        .then(setFormData({ ...initialFormState }))
        .then(history.push(`/dashboard`))
        .catch(setError);
  };

  const errors = () => {
    return tableErrors.map((tableError, idx) => (
      <ErrorAlert key={idx} error={tableError} />
    ));
  };

  return (
    <div>
      <h2>New Table</h2>
      <ErrorAlert error={error} />
      {errors()}
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
        <label className="form-label" htmlFor="capacity">
          Capacity:&nbsp;
        </label>
        <input
          onChange={handleChange}
          type="number"
          min={1}
          name="capacity"
          id="capacity"
          value={formData.capacity}
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
