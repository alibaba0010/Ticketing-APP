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
    console.log("In Error Handling: ", err.message);
    return res.status(err.statusCode).json({ error: err.message }); //json
  }

  return res.status(500).json({ error: [{ message: "Service Unavailable" }] });
}
