import { Message } from "node-nats-streaming";
import { Listener, OrderCreatedEvent, Subjects, queueGroupNamePayments } from "@alibabatickets/common";
import { Order } from "../../models/orders-payments";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupNamePayments;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    });
    await order.save();

    msg.ack();
  }
}
