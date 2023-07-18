import { CustomError } from "./customError";

export class NotFoundError extends CustomError {
  statusCode = 404;
  constructor() {
    super("Not FOund Error");
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
  serializeError() {
    return [{ message: this.message }];
  }
}
