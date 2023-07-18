import { CustomError } from "./customError";

export class DatabaseConnectionError extends CustomError {
  statusCode = 500;
  message = "Error connecting to database";

  constructor() {
    super("Error connecting to DB");
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
  serializeError() {
    return [{ message: this.message }];
  }
}
