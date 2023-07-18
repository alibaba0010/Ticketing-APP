import { ValidationError } from "express-validator";
import { CustomError } from "./customError";

// interface CustomError {
//   statusCode: number;
//   serializeError(): { message: string; field?: string }[];
// }
export class RequestValidationError extends CustomError {
  statusCode = 400;
  constructor(public error: ValidationError[]) {
    super("Invalid request params");
    // Only because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
  serializeError() {
    return this.error.map((err) => {
      return { message: err.msg, field: err.type };
    });
  }
}
