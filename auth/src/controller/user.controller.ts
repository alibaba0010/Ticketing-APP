import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { RequestValidationError } from "../middlewares/errors/validationError";
// import { DatabaseConnectionError } from "../middlewares/errors/dbConnectionError";

export const currentUser = async (req: Request, res: Response) => {
  res.json({ msg: "HEllo" });
};
// REGISTER
export const signUp = (req: Request, res: Response) => {
  const { email, passowrd } = req.body;
  const error = validationResult(req);
  console.log(`${email} with ${passowrd}`);
  //if there's error
  if (!error.isEmpty()) {
    throw new RequestValidationError(error.array());
  }
  res.status(200).json({ msg: "HEllo" });
};
// LOGIN
export const signIn = (req: Request, res: Response) => {
  res.json({ msg: "HEllo" });
};
export const signOut = (req: Request, res: Response) => {
  res.json({ msg: "HEllo" });
};
