import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { RequestValidationError } from "../middlewares/errors/validationError";
import { User } from "../models/user.mongo";
import { BadRequestError } from "../middlewares/errors/badRequest";

export const currentUser = async (req: Request, res: Response) => {
  res.json({ msg: "HEllo" });
};
// REGISTER
export const signUp = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const error = validationResult(req);
  console.log(`${email} with ${password}`); 
  //if there's error
  if (!error.isEmpty()) {
    throw new RequestValidationError(error.array());
  }
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new BadRequestError("Email in use");

  }
  const user = User.build({ email, password });
  await user.save();
  res.status(200).json({ msg: "HEllo" });
};
// LOGIN
export const signIn = (req: Request, res: Response) => {
  res.json({ msg: "HEllo" });
};
export const signOut = (req: Request, res: Response) => {
  res.json({ msg: "HEllo" });
};
