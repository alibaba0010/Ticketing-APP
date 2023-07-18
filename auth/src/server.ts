import express, { json } from "express";
import userRouter from "./routes/user.router";
import "express-async-errors";
import mongoose from "mongoose";
import { errorHandler } from "./middlewares/errors/errorHandler";
import { NotFoundError } from "./middlewares/errors/notFoundError";
const app = express();
app
  .use(json())
  .use("api/v1/users", userRouter)
  .use(errorHandler)
  .all("*", () => {
    throw new NotFoundError();
  });
(async () => {
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("Connected to MongoDB");
  } catch (e) {
    console.log(e);
  }
  app.listen(3001, () => console.log("Listen to port 3001"));
})();
