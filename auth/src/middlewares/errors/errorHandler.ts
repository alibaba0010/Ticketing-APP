import { NextFunction, Response, Request } from "express";
import { RequestValidationError } from "./validationError";
import { DatabaseConnectionError } from "./dbConnectionError";
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(`SOmething went wrong ${err} `);
  if (err instanceof RequestValidationError) {
    const formattedError = err.error.map((error) => {
      return { message: error.msg, field: error.type };
    });
    console.log("Handling Validation Error");
    return res.status(400).json({ error: formattedError });
  }
  if (err instanceof DatabaseConnectionError) {
    console.log("Handling DB Error");
    return res.status(500).json({ error: [{ message: err.message }] });
  }
  res.status(400).json({ error: [{ message: "Service Unavailable" }] });
};
