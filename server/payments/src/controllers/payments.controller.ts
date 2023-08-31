import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  UnAuthorizedError,
} from "@alibabatickets/common";
import { natsWrapper } from "../nats-wrapper";
import { Request, Response } from "express";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";

export const ticketPayment = async (req: Request, res: Response) => {
  const { token, orderId } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    throw new NotFoundError("Order Not Found");
  }
  if (order.userId !== req.currentUser!.id) {
    throw new UnAuthorizedError();
  }
  if (order.status === OrderStatus.Cancelled) {
    throw new BadRequestError("Cannot pay for an cancelled order");
  }

  const charge = await stripe.charges.create({
    currency: "usd",
    amount: order.price * 100,
    source: token,
  });
  const payment = Payment.build({
    orderId,
    stripeId: charge.id,
  });
  await payment.save();
  new PaymentCreatedPublisher(natsWrapper.client).publish({
    id: payment.id,
    orderId: payment.orderId,
    stripeId: payment.stripeId,
  });

  res.status(201).send({ id: payment.id });
};
