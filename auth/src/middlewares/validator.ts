import { body } from "express-validator";
export const validateBody = (next: () => void) => {
  body("email").isEmail().trim().withMessage("Provide a valid email"),
    body("password")
      .trim()
      .isLength({ min: 6, max: 20 })
      .withMessage("Password must be between 4 and 20 characters");
  next();
};
