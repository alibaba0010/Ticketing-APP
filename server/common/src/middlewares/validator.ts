import { body } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import RequestValidationError from "../errors/validationError";
import { Types } from "mongoose";

export const validateBody = [
  body("email").isEmail().withMessage("Email must be valid"),
  body("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Password must be between 4 and 20 characters"),
];

export const validateBodyLogIn = [
  body("email").isEmail().withMessage("Email must be valid"),
  body("password").trim().notEmpty().withMessage("You must supply a password"),
];

export const validateTicket = [
  body("title").not().isEmpty().withMessage("Title is required"), //empty string
  body("price")
    .isFloat({ gt: 0 })
    .withMessage("Price must be greater than zero"),
];

export const validatePayment = [
  body("token").not().isEmpty(),
  body("orderId").not().isEmpty(),
];

export const validateOrder = [
  body("ticketId")
    .not()
    .isEmpty()
    .custom((input: string) => Types.ObjectId.isValid(input))
    .withMessage("TicketId must be provided"),
];
export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = validationResult(req);
  //if there's error
  if (!error.isEmpty()) {
    throw new RequestValidationError(error.array());
  }
  next();
};
