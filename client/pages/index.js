import Link from "next/link";

const LandingPage = ({ currentUser, tickets, fetchError }) => {
  const ticketList = (tickets || []).map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link
            href="/tickets/[ticketId]"
            as={`/tickets/${ticket.id}`}
            legacyBehavior
          >
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <section className="py-4 mb-4 border-bottom">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h3">Welcome to GitTix</h1>
              <p className="mb-0 text-muted">
                Buy and sell tickets for the best events.
              </p>
            </div>
            <div>
              {currentUser ? (
                <div className="text-end">
                  <div className="fw-bold">Signed in as</div>
                  <div className="text-muted">{currentUser.email}</div>
                </div>
              ) : (
                <div className="text-end">
                  <div className="fw-bold">Welcome, guest</div>
                  <div className="text-muted">
                    Please sign in to access your profile
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2>Available Tickets</h2>
        {fetchError ? (
          <div className="alert alert-warning">
            Unable to fetch tickets right now. Please try again later.
          </div>
        ) : (
          <>
            {(!tickets || tickets.length === 0) && (
              <div className="text-muted mb-3">
                No tickets available at the moment.
              </div>
            )}
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Link</th>
                </tr>
              </thead>
              <tbody>{ticketList}</tbody>
            </table>
          </>
        )}
      </section>
    </div>
  );
};

// server fetch data SSR-- server side rendering process --- fetching from server
LandingPage.getInitialProps = async (context, client, currentUser) => {
  try {
    const { data } = await client.get("/api/v1/tickets");
    return {
      tickets: data || [],
      currentUser: currentUser || null,
      fetchError: false,
    };
  } catch (err) {
    console.error(
      "Error fetching tickets in LandingPage.getInitialProps:",
      err.message || err
    );
    return { tickets: [], currentUser: currentUser || null, fetchError: true };
  }
};

export default LandingPage;
