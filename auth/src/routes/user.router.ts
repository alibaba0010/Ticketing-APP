import { Router } from "express";
import {
  current_user,
  signOut,
  signIn,
  signUp,
} from "../controller/user.controller";
import {
  validateBody,
  validateBodyLogIn,
  validateRequest,
} from "../middlewares/validator";
const userRouter = Router();
import { currentUser } from "../middlewares/currentUser";

// add validate Body
userRouter
  .get("/currentuser", currentUser, current_user)
  .post("/signup", validateBody, validateRequest, signUp)
  .post("/signin", validateBodyLogIn, validateRequest, signIn)
  .post("/signout", signOut);


export default userRouter;
