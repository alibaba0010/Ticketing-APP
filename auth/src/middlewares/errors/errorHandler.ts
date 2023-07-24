import { NextFunction, Response, Request } from "express";
import { CustomError } from "./customError";
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ error: err.serializeError() });
  }

  res.status(500).json({ error: [{ message: "Service Unavailable" }] });
};
