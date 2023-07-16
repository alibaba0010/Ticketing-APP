import { NextFunction, Response, Request } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(`SOmething went wrong ${err} `);
  res.status(400).json({ message: "Something went wrong" });
};
