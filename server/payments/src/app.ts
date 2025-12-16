import express, { json } from "express";
import cookieSession from "cookie-session";
import cors from "cors";
import {
  currentUser,
  errorHandler,
  NotFoundError,
} from "@alibabatickets/common";
import paymentRouter from "./routes/payments.router";

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
  .use("/api/v1/payments", currentUser, paymentRouter)
  .use((req, res, next) => {
    throw new NotFoundError("Route doesn't exist");
  })
  .use(errorHandler);

export { app };
