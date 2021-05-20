import { useParams } from "react-router";

export default function Seat({ tables, reservations }) {
  const { reservation_id } = useParams();

  const singleRes = reservations.find(
    (res) => res.reservation_id === reservation_id
  );
  const tableMenu = tables ? (
    tables.forEach((table) => {
      if (!table.reservation_id && singleRes.people <= table.capacity) {
        return (
          <option value={table.table_id}>
            {table.table_name} - {table.capacity}
          </option>
        );
      }
    })
  ) : (
    <option defaultValue>No available tables</option>
  );

  return (
    <div>
      <select className="form-select" name="table_id">
        {tableMenu}
      </select>
    </div>
  );
}
