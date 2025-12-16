import {
  Listener,
  OrderCreatedEvent,
  Subjects,
  queueGroupNameExpiration,
} from "@alibabatickets/common";
import { JsMsg } from "nats";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupNameExpiration;

  async onMessage(data: OrderCreatedEvent["data"], msg: JsMsg) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log("Waiting this many milliseconds to process the job:", delay);

    await expirationQueue.add(
      "order:expiration",
      {
        orderId: data.id,
      },
      {
        delay,
      }
    );

    msg.ack();
  }
}
