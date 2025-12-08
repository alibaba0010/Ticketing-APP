import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function Profile({ currentUser }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const avatarLetter = currentUser?.email
    ? currentUser.email.charAt(0).toUpperCase()
    : "?";

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        className="btn btn-light d-flex align-items-center"
        onClick={() => setOpen((s) => !s)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span
          className="rounded-circle bg-secondary text-white d-inline-flex justify-content-center align-items-center"
          style={{ width: 36, height: 36 }}
        >
          {avatarLetter}
        </span>
      </button>

      {open && (
        <div
          className="card"
          style={{
            position: "absolute",
            right: 0,
            marginTop: 8,
            minWidth: 220,
            zIndex: 2000,
          }}
        >
          <div className="card-body p-2">
            {currentUser ? (
              <div>
                <div className="mb-1">
                  <strong>{currentUser.email}</strong>
                </div>
                <div className="text-muted small mb-2">
                  id: {currentUser.id}
                </div>
                <div>
                  <Link
                    href="/auth/signout"
                    className="btn btn-sm btn-outline-secondary w-100"
                  >
                    Sign Out
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-1">You're not signed in</div>
                <div className="text-muted small mb-2">
                  Sign in or create an account to buy tickets
                </div>
                <div className="d-grid gap-2">
                  <Link href="/auth/signin" className="btn btn-sm btn-primary">
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="btn btn-sm btn-outline-primary"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
