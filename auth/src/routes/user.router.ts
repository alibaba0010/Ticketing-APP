import { Router } from "express";
import { currentUser } from "../controller/user.controller";

const userRouter = Router();

userRouter.get("/currentuser", currentUser);

export default userRouter;
