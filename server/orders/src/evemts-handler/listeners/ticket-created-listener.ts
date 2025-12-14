import {
  Subjects,
  Listener,
  TicketCreatedEvent,
  queueGroupNameOrders,
} from "@alibabatickets/common";
import { Ticket } from "../../models/tickets-orders";
import { JsMsg } from "nats";
export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupNameOrders;

  async onMessage(data: TicketCreatedEvent["data"], msg: JsMsg) {
    const { id, title, price } = data;

    const ticket = Ticket.build({
      id,
      title,
      price,
    });
    await ticket.save();

    msg.ack();
  }
}
