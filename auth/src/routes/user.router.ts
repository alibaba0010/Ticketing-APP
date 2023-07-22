import { Router } from "express";
import {
  current_user,
  signOut,
  signIn,
  signUp,
} from "../controller/user.controller";
const userRouter = Router();
// add validate Body
userRouter
  .get("/currentuser", current_user)
  .post("/signup", signUp)
  .post("/signin", signIn)
  .post("/signout", signOut);

export default userRouter;
