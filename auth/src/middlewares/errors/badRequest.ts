import { CustomError } from "./customError";

export class BadRequestError extends CustomError {
  statusCode = 400;
  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
  serializeError() {
    console.log("in Bad Serialize");
    return [{ message: this.message }];
  }
}
