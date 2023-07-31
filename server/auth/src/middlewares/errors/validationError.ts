import { ValidationError } from "express-validator";
import  CustomError  from "./customError";

 class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super("Invalid request parameters");

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeError() {
    return this.errors.map((err) => {
      return { message: err.msg, field: err.type };
    });
  }
}
export { RequestValidationError as default };
