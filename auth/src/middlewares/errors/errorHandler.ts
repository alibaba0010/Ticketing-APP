import { NextFunction, Response, Request } from "express";
import { CustomError } from "./customError";
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    console.log("In Error Handling");
    return res.status(err.statusCode).send({ error: err.serializeError() }); //json
  }

  res.status(500).send({ error: [{ message: "Service Unavailable" }] });
};
