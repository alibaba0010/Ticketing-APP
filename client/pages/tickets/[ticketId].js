import Router from "next/router";
import useRequest from "../../hooks/use-request";

const TicketShow = ({ ticket, currentUser }) => {
  const { doRequest, errors } = useRequest({
    url: "/api/v1/orders",
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) =>
      Router.push("/orders/[orderId]", `/orders/${order.id}`),
  });

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-6">
        <div className="card shadow-sm border-0">
          <div className="card-body p-5">
            <h1 className="card-title fw-bold mb-4">{ticket.title}</h1>
            <h4 className="card-subtitle mb-4 text-primary">
              Price: ${parseFloat(ticket.price).toFixed(2)}
            </h4>
            {errors}
            {currentUser ? (
              <button
                onClick={() => doRequest()}
                className="btn btn-primary btn-lg w-100"
              >
                Purchase Ticket
              </button>
            ) : (
              <div className="alert alert-info text-center">
                <p className="mb-2">
                  You need to be signed in to purchase this ticket.
                </p>
                <button
                  onClick={() => Router.push("/auth/signin")}
                  className="btn btn-outline-primary"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/v1/tickets/${ticketId}`); //id
  console.log("Ticket Id: ", ticketId);

  return { ticket: data };
};

export default TicketShow;
