import { useState } from "react";
import { useHistory, useParams } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { seatResAtTable } from "../utils/api";

export default function Seat({ tables, reservations }) {
  const initialState = { table_id: 0 };
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState(null);
  const { reservation_id } = useParams();
  const history = useHistory();

  const singleRes = reservations.find((res) => {
    return res.reservation_id === Number(reservation_id);
  });

  let handleSubmit = (event) => {
    event.preventDefault();
    if (formData.table_id > 0) {
      seatResAtTable(formData.table_id, reservation_id)
        .then(setFormData(initialState))
        .then(history.push(`/dashboard`))
        .catch(setError);
    } else {
      setError({ message: "Not a valid table" });
    }
  };

  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const tableMenu = tables ? (
    tables.map((table) => {
      if (table.reservation_id === null && singleRes.people <= table.capacity) {
        return (
          <option value={table.table_id} key={table.table_id}>
            {table.table_name} - {table.capacity}
          </option>
        );
      } else return "";
    })
  ) : (
    <option defaultValue>No available tables</option>
  );

  return (
    <div>
      <h2>Seat Reservation</h2>
      <ErrorAlert error={error} />
      <form onSubmit={handleSubmit}>
        <label className="form-label" htmlFor="table_id">
          Select Table:&nbsp;
        </label>
        <select className="form-select" name="table_id" onChange={handleChange}>
          <option defaultValue>Please choose table:</option>
          {tableMenu}
        </select>
        <button className="btn btn-primary" type="submit">
          Submit
        </button>
        <button className="btn btn-secondary" onClick={history.goBack}>
          Cancel
        </button>
      </form>
    </div>
  );
}
