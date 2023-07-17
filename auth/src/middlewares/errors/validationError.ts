import { ValidationError } from "express-validator";
import { DatabaseConnectionError } from "./dbConnectionError";

export class RequestValidationError extends Error {
  constructor(public error: ValidationError[]) {
    super();
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
}
