import express, { json } from "express";
import "express-async-errors";
import cookieSession from "cookie-session";

import { errorHandler, NotFoundError } from "@alibabatickets/common";
import paymentRouter from "./routes/payments.router";

const app = express();

app
  .set("trust proxy", true)
  .use(json())
  .use(
    cookieSession({
      signed: false,
      secure: false, //process.env.NODE_ENV !== "test"
      maxAge: 24 * 60 * 60 * 1000,
    })
  ) // 24 hours
  .use("/api/v1/payments", paymentRouter)
  .use("*", async () => {
    throw new NotFoundError("Route doesn't exist");
  })
  .use(errorHandler);

export { app };
