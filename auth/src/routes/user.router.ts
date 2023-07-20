import { Router } from "express";
import {
  currentUser,
  signOut,
  signIn,
  signUp,
} from "../controller/user.controller";
import { validateBody } from "../middlewares/validator";
const userRouter = Router();

userRouter
  .get("/currentuser", currentUser)
  .post("/signup", signUp)
  .post("/signin", validateBody, signIn)
  .post("/signout", signOut);

export default userRouter;
