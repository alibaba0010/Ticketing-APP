import express, { json } from "express";
import userRouter from "./routes/user.router";
import "express-async-errors";
import mongoose from "mongoose";
import connectDB from "./db";
import cookieSession from "cookie-session";
import { errorHandler } from "./middlewares/errors/errorHandler";
import { NotFoundError } from "./middlewares/errors/notFoundError";
const app = express();

app
  .use(json())
  .use(cookieSession({ signed: false, secure: true }))
  .use("/api/v1/users", userRouter)
  .use(errorHandler)
  .all("*", () => {
    throw new NotFoundError();
  });
(async () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_KEY must be defined");
  }
  try {
    await connectDB();
  } catch (e) {
    console.log(e);
  }
  app.listen(3001, () => console.log("Listen to port 3001"));
})();
