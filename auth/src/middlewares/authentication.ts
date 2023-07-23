import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "./errors/notAuthorizedError";

export const authentication = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    throw new NotAuthorizedError();
  }

  next();
};
