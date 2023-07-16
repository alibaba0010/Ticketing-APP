import express, { json } from "express";
import userRouter from "./routes/user.router";
const app = express();
app.use(json()).use("api/v1/users", userRouter);
app.listen(3001, () => console.log("Listen to port 3001"));
