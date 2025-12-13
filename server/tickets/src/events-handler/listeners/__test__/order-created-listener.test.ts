import { JsMsg } from "nats";
import { Types } from "mongoose";
import { OrderCreatedEvent, OrderStatus } from "@alibabatickets/common";
import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/tickets.mongo";
import { jest, expect, it } from "@jest/globals";

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // Create and save a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 99,
    userId: "asdf",
  });
  await ticket.save();

  // Create the fake data event
  const data: OrderCreatedEvent["data"] = {
    id: new Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: "alskdfj",
    expiresAt: "alskdjf",
    ticket: {
      id: ticket._id.toString(),
      price: ticket.price,
    },
  };

  // @ts-ignore
  const msg: JsMsg = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it("sets the userId of the ticket", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket._id.toString());

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it("acks the message", async () => {
  const { listener, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("publishes a ticket updated event", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const rawData = (natsWrapper.client.publish as jest.Mock).mock.calls[0][1];
  const decoder = new TextDecoder();
  const ticketUpdatedData = JSON.parse(
    typeof rawData === "string"
      ? rawData
      : decoder.decode(rawData as Uint8Array)
  );

  expect(data.id).toEqual(ticketUpdatedData.orderId);
});
