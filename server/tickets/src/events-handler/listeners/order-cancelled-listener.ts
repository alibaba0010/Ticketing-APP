import {
  Listener,
  NotFoundError,
  OrderCancelledEvent,
  Subjects,
  queueGroupNameTickets,
} from "@alibabatickets/common";
import { Ticket } from "../../models/tickets.mongo";
import { JsMsg } from "nats";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupNameTickets;

  async onMessage(data: OrderCancelledEvent["data"], msg: JsMsg) {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new NotFoundError("Ticket not found");
    }

    ticket.set({ orderId: undefined });
    await ticket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      orderId: ticket.orderId,
      userId: ticket.userId,
      price: ticket.price,
      title: ticket.title,
      version: ticket.version,
    });

    msg.ack();
  }
}
