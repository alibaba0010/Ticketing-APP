import { stripe } from "../stripe";
import { Order } from "../models/orders-payments";
import { Payment } from "../models/payment.mongo";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";
import {
  authentication,
  validateRequest,
  validateOrder,
} from "@alibabatickets/common";
import { Router } from "express";
import {} from "../controllers/payments.controller";


"/api/payments",
  requireAuth,
  validateRequest,
  async (req: Request, res: Response) => {};


const paymentRouter = Router();

paymentRouter;
.post("/:id", authentication, )

export default paymentRouter;
