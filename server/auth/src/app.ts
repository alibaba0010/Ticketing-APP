// import "module-alias/register";
import express, { json } from "express";
import "express-async-errors";
// import moduleAlias from "module-alias";
// moduleAlias.addAlias("@app/common", __dirname + "../../../common/src");

import cookieSession from "cookie-session";
import cors from "cors";
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from "@alibabatickets/common";
import userRouter from "./routes/user.router";

const app = express();
app
  .set("trust proxy", true)
  .use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  )
  .use(json())
  .use(
    cookieSession({
      signed: false,
      secure: false, //process.env.NODE_ENV !== "test"
      maxAge: 24 * 60 * 60 * 1000,
    })
  ) // 24 hours

  .use("/api/v1/users", userRouter)
  .use("*", (req, res) => {
    throw new NotFoundError(
      `Route doesn't exist: ${req.method} ${req.originalUrl}`
    );
  });
// app.use(errorHandler);
app.use(errorHandler);

export { app };
