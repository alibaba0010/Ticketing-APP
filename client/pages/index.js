import Link from "next/link";

const LandingPage = ({ currentUser, tickets, fetchError }) => {
  const ticketList = (tickets || []).map((ticket) => {
    return (
      <div className="col-lg-4 col-md-6 mb-4" key={ticket.id}>
        <div className="card h-100 border-0 shadow-sm animate-fade-in">
          <div className="card-body d-flex flex-column">
            <h5 className="card-title fw-bold text-primary">{ticket.title}</h5>
            <h6 className="card-subtitle mb-3 text-muted">
              ${parseFloat(ticket.price).toFixed(2)}
            </h6>
            <div className="mt-auto">
              <Link
                href="/tickets/[ticketId]"
                as={`/tickets/${ticket.id}`}
                className="btn btn-primary w-100"
              >
                View Ticket
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="landing-page">
      <section className="hero-section py-5 mb-5 rounded-3 bg-white shadow-sm px-4">
        <div className="row align-items-center">
          <div className="col-md-7">
            <h1 className="display-4 fw-bold text-dark mb-3">
              Tickets made <span className="text-primary">simple</span>.
            </h1>
            <p className="lead text-muted mb-4">
              The easiest way to buy and sell tickets for your favorite events.
              Secure, fast, and reliable.
            </p>
            {!currentUser && (
              <div className="d-flex gap-3">
                <Link
                  href="/auth/signup"
                  className="btn btn-primary btn-lg px-4"
                >
                  Get Started
                </Link>
                <Link
                  href="/auth/signin"
                  className="btn btn-outline-secondary btn-lg px-4"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
          <div className="col-md-5 text-end d-none d-md-block">
            {/* Placeholder for a hero image if we had one, for now utilizing typography and spacing */}
            <div className="p-5 bg-light rounded-circle d-inline-block">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                fill="currentColor"
                className="bi bi-ticket-perforated-fill text-primary"
                viewBox="0 0 16 16"
              >
                <path d="M0 4.5A1.5 1.5 0 0 1 1.5 3h13A1.5 1.5 0 0 1 16 4.5V6a.5.5 0 0 1-.5.5 1.5 1.5 0 1 1 0 3 .5.5 0 0 1 .5.5v1.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 11.5V10a.5.5 0 0 1 .5-.5 1.5 1.5 0 1 1 0-3A.5.5 0 0 1 0 6V4.5Zm4-1v1h1v-1H4Zm1 3v-1H4v1h1Zm7 0v-1h-1v1h1Zm-1-2h1v-1h-1v1Zm-6 3H4v1h1v-1Zm7 1v-1h-1v1h1Zm-7 1H4v1h1v-1Zm7 1v-1h-1v1h1Zm-8 1v1h1v-1H4Zm7 1h1v-1h-1v1Z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold m-0">Available Tickets</h2>
          {currentUser && (
            <Link
              href="/tickets/new"
              className="btn btn-sm btn-outline-primary"
            >
              Sell a Ticket
            </Link>
          )}
        </div>

        {fetchError ? (
          <div className="alert alert-danger shadow-sm border-0" role="alert">
            <h4 className="alert-heading">Oops!</h4>
            <p>
              Something went wrong while fetching tickets. Please try again
              later.
            </p>
          </div>
        ) : (
          <div className="row">
            {(!tickets || tickets.length === 0) && (
              <div className="col-12 text-center py-5">
                <p className="text-muted fs-5">
                  No tickets available right now.
                </p>
                {currentUser && (
                  <p>
                    <Link href="/tickets/new" className="text-primary">
                      Be the first to list one!
                    </Link>
                  </p>
                )}
              </div>
            )}
            {ticketList}
          </div>
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
