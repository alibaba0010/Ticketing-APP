import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.mongo";
import BadRequestError from "../middlewares/errors/badRequest";
import { PasswordMgt } from "../services/hashPassword";
export const current_user = async (req: Request, res: Response) => {
  res.json({ currentUser: req.currentUser || null });
};
// REGISTER
export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  const existingEmail = await User.findOne({ email });
  try {
    if (existingEmail) {
      throw new BadRequestError("Email already exists");
    }
    const user = User.build({ email, password });
    await user.save();
    // Generate JWT
    const userToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET!
    );
    // Store it on session object
    req.session = {
      jwt: userToken,
    };

    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
};

// LOGIN
export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  try {
    if (!existingUser) {
      throw new BadRequestError("Invalid login credentials");
    }
    const comparePassword = await PasswordMgt.comparePassword(
      existingUser.password,
      password
    );
    if (!comparePassword) {
      throw new BadRequestError("Invalid Credentials");
    }
    // Generate JWT
    const userToken = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_SECRET!
    );

    // Store it on session object
    req.session = {
      jwt: userToken,
    };
    res.status(200).json({ existingUser });
  } catch (error) {
    next(error);
  }
};
export const signOut = (req: Request, res: Response) => {
  req.session = null;

  res.json({ message: "Signout successful" });
};
