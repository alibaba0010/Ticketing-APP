import {
  Subjects,
  Listener,
  PaymentCreatedEvent,
  OrderStatus,
  queueGroupNameOrders,
} from "@alibabatickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders.mongo";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupNameOrders;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    order.set({
      status: OrderStatus.Completed,
    });
    await order.save();

    msg.ack();
  }
}
