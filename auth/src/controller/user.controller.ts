import { Request, Response } from "express";
import { validationResult } from "express-validator";

export const currentUser = async (req: Request, res: Response) => {
  res.json({ msg: "HEllo" });
};
// REGISTER
export const signUp = (req: Request, res: Response) => {
  const { email, passowrd } = req.body;
  console.log(`${email} with ${passowrd}`);
  const error = validationResult(req);
  //if there's error
  if (!error.isEmpty()) {
    res.status(400).json(error.array());
  }
  res.json({ msg: "HEllo" });
};
export const signIn = (req: Request, res: Response) => {
  res.json({ msg: "HEllo" });
};
export const signOut = (req: Request, res: Response) => {
  res.json({ msg: "HEllo" });
};
