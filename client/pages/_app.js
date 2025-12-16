import "bootstrap/dist/css/bootstrap.css";
import "../styles/globals.css";
import buildClient from "../api/build-client";
import Header from "../components/header.js";
import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  const router = useRouter();

  useEffect(() => {
    // Define public paths that don't require authentication
    // We allow '/' (landing), auth pages, and viewing ticket details
    const isPublicPath =
      ["/", "/auth/signin", "/auth/signup"].includes(router.pathname) ||
      router.pathname.startsWith("/tickets/");

    // If user is not signed in and trying to access a protected route, redirect to home
    if (!currentUser && !isPublicPath) {
      router.push("/");
    }
  }, [currentUser, router.pathname]);

  return (
    <div>
      <Head>
        <title>GitTix - Premium Ticketing</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Header currentUser={currentUser} />
      <div className="container mt-5">
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
