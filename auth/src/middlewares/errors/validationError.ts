import { ValidationError } from "express-validator";
import { CustomError } from "./customError";

// interface CustomError {
//   statusCode: number;
//   serializeError(): { message: string; field?: string }[];
// }
export class RequestValidationError extends CustomError {
  statusCode = 400;
  constructor(public error: ValidationError[], message: string) {
    super(message);
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
  serializeError() {
    return this.error.map((err) => {
      return { message: err.msg, field: err.type };
    });
  }
}
