import express, { json } from "express";
import userRouter from "./routes/user.router";
import "express-async-errors";
import mongoose from "mongoose";
import connectDB from "./db";

import { errorHandler } from "./middlewares/errors/errorHandler";
import { NotFoundError } from "./middlewares/errors/notFoundError";
const app = express();

console.log("In server");
app
  .use(json())
  .use("/", (req, res) => res.json({ msg: "Hello" }))
  .use("api/v1/users", userRouter)
  .use(errorHandler)
  .all("*", () => {
    throw new NotFoundError();
  });
(async () => {
  try {
    await connectDB();
  } catch (e) {
    console.log(e);
  }
  app.listen(3001, () => console.log("Listen to port 3001"));
})();
