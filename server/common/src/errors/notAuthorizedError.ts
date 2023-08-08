import CustomError from "./customError";

export class UnAuthorizedError extends CustomError {
  statusCode = 401;

  constructor() {
    super("Not Authorized");

    Object.setPrototypeOf(this, UnAuthorizedError.prototype);
  }

  serializeError() {
    return [{ message: "Not authorized" }];
  }
}

export { UnAuthorizedError as default };
