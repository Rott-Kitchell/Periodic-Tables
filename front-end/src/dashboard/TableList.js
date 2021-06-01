import { Fragment } from "react";

import { freeUpTable } from "../utils/api";

export default function TableList({ tables }) {
  const handleFinish = (table_id) => {
    let result = window.confirm(
      "Is this table ready to seat new guests? \n  \n This cannot be undone."
    );
    if (result)
      freeUpTable(table_id)
        .then(() => window.location.reload())
        .catch((error) => console.log(error));
  };

  if (tables) {
    return tables.map((table) => {
      return (
        <div className="col-lg-6 p-0" key={table.table_id}>
          <div
            className="card border-dark"
            id={table.table_id}
            name={table.table_id}
          >
            <div className="card-body p-2">
              <h6 className="card-title text-center">{table.table_name}</h6>
              <div className="row row-col-2 justify-content-between m-1">
                <p data-table-id-status={table.table_id} className="text-muted">
                  {table.reservation_id ? (
                    <div className="text-danger">Occupied</div>
                  ) : (
                    <div className="text-success">Free</div>
                  )}
                </p>
                {table.reservation_id ? (
                  <button
                    type="submit"
                    data-table-id-finish={table.table_id}
                    className="btn btn-sm btn-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      handleFinish(table.table_id);
                    }}
                  >
                    Finish
                  </button>
                ) : (
                  <Fragment />
                )}
              </div>
            </div>
          </div>
        </div>
      );
    });
  } else {
    return <div>No Tables</div>;
  }
}
