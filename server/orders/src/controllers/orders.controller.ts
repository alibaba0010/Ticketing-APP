import { Response, Request } from "express";
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  UnAuthorizedError,
} from "@alibabatickets/common";
import { TicketCreatedPublisher } from "../evemts-handler/publishers/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";
import { TicketUpdatedPublisher } from "../evemts-handler/publishers/ticket-updated-publisher";
import { Order } from "../models/orders.mongo";
import { Ticket } from "../models/tickets-orders";

// CREATE ORDER
export const createOrder = async (req: Request, res: Response) => {
  const { ticketId } = req.body;
  // EXPIRATION TIME-- 5MINS
  const EXPIRATION = 1 * 60;

  // Find the ticket the user is trying to order in the database
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new NotFoundError("Tickets Not Found");
  }

  // To make sure that the ticket is not already reserved
  const isReserved = await ticket.isReserved();
  if (isReserved) {
    throw new BadRequestError("Ticket is already reserved");
  }

  // Calculate an expiration date for this order
  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION);

  // Build the order and save it to the database
  const order = Order.build({
    userId: req.currentUser!.id,
    status: OrderStatus.Created,
    expiresAt: expiration,
    ticket,
  });
  await order.save();

  // // Publish an event saying that an order was created
  // new OrderCreatedPublisher(natsWrapper.client).publish({
  //   id: order.id,
  //   version: order.version,
  //   status: order.status,
  //   userId: order.userId,
  //   expiresAt: order.expiresAt.toISOString(),
  //   ticket: {
  //     id: ticket.id,
  //     price: ticket.price,
  //   },
  // });

  res.status(201).json(order);
};

// GET ORDER WITH ID
export const getOrderWithId = async (req: Request, res: Response) => {
  const { id } = req.params;
  const order = await Order.findById(id).populate("ticket");

  if (!order) {
    throw new NotFoundError("Order Not Found");
  }
  if (order.userId !== req.currentUser!.id) {
    throw new UnAuthorizedError();
  }
  res.status(200).json(order);
};

// GET TICKET WITH ID
export const getOrders = async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser!.id,
  }).populate("ticket");

  if (!orders) {
    throw new NotFoundError("Order not found");
  }
  res.status(200).json(orders);
};

// UPDATE ORDER
export const updateOrder = async (req: Request, res: Response) => {};

// DELETE ORDER WITH ID
export const cancelOrderWithId = async (req: Request, res: Response) => {
  const { id } = req.params;
  const order = await Order.findById(id).populate("ticket");

  if (!order) {
    throw new NotFoundError("Order not FOund");
  }
  if (order.userId !== req.currentUser!.id) {
    throw new UnAuthorizedError();
  }
  order.status = OrderStatus.Cancelled;
  await order.save();

  // publishing an event saying this was cancelled!
  // new OrderCancelledPublisher(natsWrapper.client).publish({
  //   id: order.id,
  //   version: order.version,
  //   ticket: {
  //     id: order.ticket.id,
  //   },
  // });

  res.status(204).json(order);
};
