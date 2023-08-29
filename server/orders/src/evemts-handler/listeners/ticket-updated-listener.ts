import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  TicketUpdatedEvent,
  queueGroupNameOrders,
  NotFoundError
} from "@alibabatickets/common";
import { Ticket } from "../../models/tickets-orders";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupNameOrders;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new NotFoundError("Ticket not found");
    }

    const { title, price } = data;
    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
