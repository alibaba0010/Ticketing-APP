import { Router } from "express";
import {
  authentication,
  validateRequest,
  validatePayment,
} from "@alibabatickets/common";
import { ticketPayment } from "../controllers/payments.controller";

const paymentRouter = Router();

paymentRouter.post(
  "/",
  authentication,
  validatePayment,
  validateRequest,
  ticketPayment
);

export default paymentRouter;
