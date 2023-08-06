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
  if ((err.name = "CastError")) {
    //Error
    return res.status(400).json({ error: { message: err } }); //json
  }

  return res.status(500).json({ error: [{ message: "Service Unavailable" }] });
};
