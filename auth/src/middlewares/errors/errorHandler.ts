import { NextFunction, Response, Request } from "express";
import CustomError from "./customError";
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    //Error
    return res.status(err.statusCode).json({ error: err.serializeError() }); //json
  }

  return res.status(500).json({ error: [{ message: "Service Unavailable" }] });
};
