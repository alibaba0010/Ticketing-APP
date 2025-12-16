
import { Router } from "express";
import {
  authentication,
  validateRequest,
  validatePayment,
} from "@alibabatickets/common";
import {} from "../controllers/payments.controller";

const paymentRouter = Router();

paymentRouter.post("/", authentication, validatePayment, validateRequest);

export default paymentRouter;
