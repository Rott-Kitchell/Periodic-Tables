import { Fragment } from "react";

import { changeReservationStatus, freeUpTable } from "../utils/api";

export default function TableList({ tables, loadDashboard }) {
  const handleFinish = (table) => {
    let result = window.confirm(
      "Is this table ready to seat new guests? \n  \n This cannot be undone."
    );
    if (result)
      freeUpTable(table.table_id)
        .then(loadDashboard)
        .catch((error) => console.log(error));
  };

  if (tables) {
    return tables.map((table) => {
      return (
        <div
          className="card mb-1"
          key={table.table_id}
          id={table.table_id}
          name={table.table_id}
        >
          <div className="card-body">
            <h5 className="d-inline-block card-title text-center">
              {table.table_name}
            </h5>
            <h6
              data-table-id-status={table.table_id}
              className="card-subtitle text-muted"
            >
              {table.reservation_id !== null ? "Occupied" : "Free"}
            </h6>
            {table.reservation_id !== null ? (
              <button
                type="submit"
                data-table-id-finish={table.table_id}
                className="btn btn-primary mt-3"
                onClick={(e) => {
                  e.preventDefault();
                  handleFinish(table);
                }}
              >
                Finish
              </button>
            ) : (
              <Fragment />
            )}
          </div>
        </div>
      );
    });
  } else {
    return <div>No Tables</div>;
  }
}
