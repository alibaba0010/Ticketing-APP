export abstract class CustomError extends Error {
  abstract statusCode: number;
  constructor(message: string) {
    console.log("In custom error: ", message);
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
  abstract serializeError(): { message: string; field?: string }[];
}
