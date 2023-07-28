import { NextFunction, Response, Request } from "express";
import CustomError from "./customError";
export async function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("In Handling Error page");
  if (err instanceof CustomError) {
    //Error
    console.log("In Error Handling: ", err.serializeError());
    return res.status(err.statusCode).send({ error: err.serializeError() }); //json
  }

  return res.status(500).send({ error: [{ message: "Service Unavailable" }] });
}
