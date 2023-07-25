import express, { json } from "express";
import userRouter from "./routes/user.router";
import "express-async-errors";
import cookieSession from "cookie-session";
import { errorHandler } from "./middlewares/errors/errorHandler";
import { NotFoundError } from "./middlewares/errors/notFoundError";
const app = express();

app
  .set("trust proxy", true)
  .use(json())
  .use(
    cookieSession({ signed: false, secure: true, maxAge: 24 * 60 * 60 * 1000 })
  ) // 24 hours
  .use("/api/v1/users", userRouter)
  .all("*", () => {
    throw new NotFoundError();
  })
  .use(errorHandler);

export { app };
