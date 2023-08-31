
import { stripe } from '../stripe';
import { Order } from '../models/order';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';


router.post(
  '/api/payments',
  requireAuth,
  [body('token').not().isEmpty(), body('orderId').not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
 
  }
);

import {
  authentication,
  validateRequest,
  validateOrder,
} from "@alibabatickets/common";
import { Router } from "express";
import {
  createOrder,
  getOrderWithId,
  getOrders,
  cancelOrderWithId,
} from "../controllers/orders.controller";

const ticketRouter = Router();

ticketRouter
  .get("/:id", authentication, getOrderWithId)
  .get("/", authentication, getOrders)
  .post("/", authentication, validateOrder, validateRequest, createOrder)
  // .patch("/:id",authentication, validateOrder,  updateTicket)
  .delete("/:id", authentication, cancelOrderWithId);
export default ticketRouter;
