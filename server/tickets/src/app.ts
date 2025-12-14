// import "module-alias/register";
import express, { json } from "express";
import cookieSession from "cookie-session";
import cors from "cors";

import { errorHandler, NotFoundError } from "@alibabatickets/common";
import ticketRouter from "./routes/tickets.router";

const app = express();

app
  .set("trust proxy", true)
  .use(json())
  .use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  )
  .use(
    cookieSession({
      signed: false,
      secure: false, //process.env.NODE_ENV !== "test"
      maxAge: 24 * 60 * 60 * 1000,
    })
  ) // 24 hours
  .use("/api/v1/tickets", ticketRouter)
  .use((req, res) => {
    throw new NotFoundError("Route doesn't exist");
  })
  .use(errorHandler);

export { app };
