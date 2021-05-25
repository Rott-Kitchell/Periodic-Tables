export default function TableList({ tables }) {
  if (tables) {
    return tables.map((table) => {
      const status = table.reservation_id !== null ? "Occupied" : "Free";
      return (
        <div className="card mb-1" key={table.table_id} id={table.table_id}>
          <div className="card-body">
            <h5 className="d-inline-block card-title text-center">
              {table.table_name}
            </h5>
            <h6
              className="card-subtitle mb-2 text-muted"
              data-table-id-status={table.table_id}
            >
              {status}
            </h6>
          </div>
        </div>
      );
    });
  } else {
    return <div>No Tables</div>;
  }
}
