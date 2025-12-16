import Link from "next/link";
import Profile from "./profile";

export default ({ currentUser }) => {
  const links = [
    !currentUser && { label: "Sign Up", href: "/auth/signup" },
    !currentUser && { label: "Sign In", href: "/auth/signin" },
    currentUser && { label: "Sell Tickets", href: "/tickets/new" },
    currentUser && { label: "My Orders", href: "/orders" },
    currentUser && { label: "Sign Out", href: "/auth/signout" },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <li key={href} className="nav-item">
          <Link href={href} className="nav-link px-3">
            {label}
          </Link>
        </li>
      );
    });

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <Link href="/" className="navbar-brand">
          GitTix
        </Link>
        <div className="d-flex justify-content-end align-items-center">
          <Profile currentUser={currentUser} />
          <ul className="nav d-flex align-items-center ms-3">{links}</ul>
        </div>
      </div>
    </nav>
  );
};
