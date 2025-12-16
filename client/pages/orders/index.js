const OrderIndex = ({ orders }) => {
  return (
    <div className="card shadow-sm border-0 mt-5">
      <div className="card-header bg-white border-0 py-3">
        <h2 className="mb-0 fw-bold">My Orders</h2>
      </div>
      <div className="card-body p-0">
        {orders.length === 0 ? (
          <div className="p-4 text-center text-muted">
            You have no orders yet.
          </div>
        ) : (
          <ul className="list-group list-group-flush">
            {orders.map((order) => {
              return (
                <li
                  key={order.id}
                  className="list-group-item d-flex justify-content-between align-items-center py-3 px-4"
                >
                  <div>
                    <h5 className="mb-1">{order.ticket.title}</h5>
                    <small className="text-muted">Order ID: {order.id}</small>
                  </div>
                  <span
                    className={`badge rounded-pill ${
                      order.status === "complete"
                        ? "bg-success"
                        : order.status === "cancelled"
                        ? "bg-danger"
                        : "bg-warning text-dark"
                    }`}
                  >
                    {order.status}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get("/api/v1/orders");

  return { orders: data };
};

export default OrderIndex;
