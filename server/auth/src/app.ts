import "module-alias/register";
import express, { json } from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError } from "@app/common";
import userRouter from "./routes/user.router";

console.log("Hello");

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
  .use("/api/v1/users", userRouter)
  .use("*", async () => {
    throw new NotFoundError("Route doesn't exist");
  })
  .use(errorHandler);

export { app };
