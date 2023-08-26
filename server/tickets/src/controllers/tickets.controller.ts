import { Response, Request } from "express";
import { Ticket } from "../models/tickets.mongo";
import { NotFoundError, UnAuthorizedError } from "@alibabatickets/common";
import { TicketCreatedPublisher } from "../evemts-handler/publishers/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";

export const createTicket = async (req: Request, res: Response) => {
  const { title, price } = req.body;

  const ticket = Ticket.build({
    title,
    price,
    userId: req.currentUser!.id,
  });

  await ticket.save();
  await new TicketCreatedPublisher(natsWrapper.client).publish({
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId,
    version: ticket.version,
  });
  res.status(201).json(ticket);
};

// GET TICKET WITH ID
export const getTicketWithId = async (req: Request, res: Response) => {
  const { id } = req.params;
  const ticket = await Ticket.findById(id);

  if (!ticket) {
    throw new NotFoundError("Ticket not found");
  }
  res.status(200).json(ticket);
};

// UPDATE TICKET
export const updateTicket = async (req: Request, res: Response) => {
  const { id } = req.params;
  const ticket = await Ticket.findById(id);

  if (!ticket) {
    throw new NotFoundError("Ticket not found");
  }
  ticket.set({
    title: req.body.title,
    price: req.body.price,
  });
  if (ticket.userId !== req.currentUser!.id) {
    throw new UnAuthorizedError();
  }

  await ticket.save();

  res.status(200).json(ticket);
};
