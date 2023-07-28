import { CustomError } from "./customError";

export class NotFoundError extends CustomError {
  statusCode = 404;
  // constructor() {
  //   super("Route Not Found");
  //   Object.setPrototypeOf(this, NotFoundError.prototype);
  // }
  // serializeError() {
  //   return [{ message: "Route Not Found" }];
  // }
  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeError() {
    return [{ message: this.message }];
  }
}
