import { Router } from "express";
import {
  currentUser,
  signOut,
  signIn,
  signUp,
} from "../controller/user.controller";
const userRouter = Router();

userRouter
  .get("/currentuser", currentUser)
  .post("/signup", signUp)
  .post("/signin", signIn)
  .post("/signout", signOut);

export default userRouter;
