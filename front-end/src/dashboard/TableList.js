export default function TableList({ tables }) {
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
            <p data-table-id-status={table.table_id}>
              {table.reservation_id ? "Occupied" : "Free"}
            </p>
          </div>
        </div>
      );
    });
  } else {
    return <div>No Tables</div>;
  }
}
