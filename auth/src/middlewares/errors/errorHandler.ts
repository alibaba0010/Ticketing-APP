import { NextFunction, Response, Request } from "express";
import { CustomError } from "./customError";
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(`SOmething went wrong ${err} `);
  if (err instanceof CustomError) {
    console.log("Handling Validation Error");
    return res.status(err.statusCode).json({ error: err.serializeError() });
  }
  // if (err instanceof DatabaseConnectionError) {
  //   console.log("Handling DB Error");
  //   return res.status(err.statusCode).json({ error: err.serializeError() });
  // }
  res.status(500).json({ error: [{ message: "Service Unavailable" }] });
};
