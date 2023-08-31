import {
  Listener,
  Subjects,
  ExpirationCompletedEvent,
  OrderStatus,
  queueGroupNameOrders,
  NotFoundError,
} from "@alibabatickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders.mongo";

import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<
  ExpirationCompletedEvent
> {
  queueGroupName = queueGroupNameOrders;
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;

  async onMessage(data: ExpirationCompletedEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId).populate("ticket");

    if (!order) {
      throw new  NotFoundError("Order not found");
    }
    if (order.status === OrderStatus.Completed) {
      return msg.ack();
    }

    order.set({
      status: OrderStatus.Cancelled,
    });
    await order.save();
    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    msg.ack();
  }
}
