import { useState, useEffect } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";

export default () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, error } = useRequest({
    url: "/api/v1/users/signin",
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push("/"),
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    await doRequest();
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-5">
        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
            <h1 className="text-center mb-4 fw-bold text-dark">Sign In</h1>
            <form onSubmit={onSubmit}>
              <div className="form-group mb-3">
                <label className="form-label text-muted">Email Address</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  placeholder="name@example.com"
                />
              </div>
              <div className="form-group mb-4">
                <label className="form-label text-muted">Password</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="form-control"
                  placeholder="••••••"
                />
              </div>
              {error}
              <button className="btn btn-primary w-100 py-2">Sign In</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
