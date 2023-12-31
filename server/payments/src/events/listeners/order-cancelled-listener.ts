import {
  OrderCancelledEvent,
  Subjects,
  Listener,
  OrderStatus,
  queueGroupNamePayments,
  NotFoundError,
} from "@alibabatickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders-payments";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupNamePayments;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    msg.ack();
  }
}
