import { Request, Response, NextFunction } from "express";
import { UnAuthorizedError } from "../errors/notAuthorizedError";

export const authentication = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("In Authentication current user: ", req.currentUser);
  console.log("In Authentication req body: ", req.body);
  if (!req.currentUser) {
    throw new UnAuthorizedError();
  }

  next();
};
