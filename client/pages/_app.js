import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import Header from "../components/header.js";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  console.log("In App component.....");
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  try {
    const { data } = await client.get("/api/v1/users/currentuser");

    let pageProps = {};
    if (appContext.Component.getInitialProps) {
      pageProps = await appContext.Component.getInitialProps(
        appContext.ctx,
        client,
        data.currentUser
      );
    }

    return {
      pageProps,
      // ensure currentUser is explicitly null when not present
      currentUser:
        data && typeof data.currentUser !== "undefined"
          ? data.currentUser
          : null,
    };
  } catch (err) {
    // If the current user endpoint fails, don't block rendering — treat as not signed in
    console.error(
      "Error fetching current user in _app.js:",
      err && err.message ? err.message : err
    );

    let pageProps = {};
    if (appContext.Component.getInitialProps) {
      pageProps = await appContext.Component.getInitialProps(
        appContext.ctx,
        client,
        null
      );
    }

    return {
      pageProps,
      currentUser: null,
    };
  }
};

export default AppComponent;
