import Link from "next/link";
import client from "../api/build-client";
// tickets & current user from server
const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
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
      <h2>Tickets</h2>
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
    </div>
  );
};

// server fetch data SSR-- server side rendering process --- fetching from server
LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get("/api/v1/tickets");

  return { users: data };
};

export default LandingPage;
