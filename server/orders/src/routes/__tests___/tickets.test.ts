import request from "supertest";
import { Schema, model, Types } from "mongoose";

import { app } from "../../app";
import { Ticket } from "../../models/tickets.mongo";
import { natsWrapper } from "tickets/src/nats-wrapper";

// *******CREATING A TICKET*****
it("has a route handler listening to /ap1/v1/tickets for post requests", async () => {
  const response = await request(app).post("/ap1/v1/v1/tickets").send({});

  expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
  await request(app).post("/ap1/v1/tickets").send({}).expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post("/ap1/v1/tickets")
    .set("Cookie", global.login())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
  await request(app)
    .post("/ap1/v1/tickets")
    .set("Cookie", global.login())
    .send({
      title: "",
      price: 10,
    })
    .expect(400);

  await request(app)
    .post("/ap1/v1/tickets")
    .set("Cookie", global.login())
    .send({
      price: 10,
    })
    .expect(400);
});

it("returns an error if an invalid price is provided", async () => {
  await request(app)
    .post("/ap1/v1/tickets")
    .set("Cookie", global.login())
    .send({
      title: "asldkjf",
      price: -10,
    })
    .expect(400);

  await request(app)
    .post("/ap1/v1/tickets")
    .set("Cookie", global.login())
    .send({
      title: "laskdfj",
    })
    .expect(400);
});

it("creates a ticket with valid inputs", async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const title = "asldkfj";

  await request(app)
    .post("/ap1/v1/tickets")
    .set("Cookie", global.login())
    .send({
      title,
      price: 20,
    })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(20);
  expect(tickets[0].title).toEqual(title);
});

it("publishes an event", async () => {
  const title = "asldkfj";

  await request(app)
    .post("/api/v1/tickets")
    .set("Cookie", global.login())
    .send({
      title,
      price: 20,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

// *******UPDATING A TICKET WITH ITS ID*****
it("returns a 404 if the ticket is not found", async () => {
  const id = new Types.ObjectId().toHexString();

  await request(app).get(`/ap1/v1/tickets/${id}`).send().expect(404);
});

it("returns the ticket if the ticket is found", async () => {
  const title = "concert";
  const price = 20;

  const response = await request(app)
    .post("/ap1/v1/tickets")
    .set("Cookie", global.login())
    .send({
      title,
      price,
    })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/ap1/v1/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});

// *******GETTING A TICKET WITH ITS ID*****

it("returns a 404 if the provided id does not exist", async () => {
  const id = new Types.ObjectId().toHexString();
  await request(app)
    .patch(`/api/v1/tickets/${id}`)
    .set("Cookie", global.login())
    .send({
      title: "aslkdfj",
      price: 20,
    })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  const id = new Types.ObjectId().toHexString();
  await request(app)
    .patch(`/api/v1/tickets/${id}`)
    .send({
      title: "aslkdfj",
      price: 20,
    })
    .expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
  const response = await request(app)
    .post("/api/v1/tickets")
    .set("Cookie", global.login())
    .send({
      title: "asldkfj",
      price: 20,
    });

  await request(app)
    .patch(`/api/v1/tickets/${response.body.id}`)
    .set("Cookie", global.login())
    .send({
      title: "alskdjflskjdf",
      price: 1000,
    })
    .expect(401);
});

it("returns a 400 if the user provides an invalid title or price", async () => {
  const cookie = global.login();

  const response = await request(app)
    .post("/api/v1/tickets")
    .set("Cookie", cookie)
    .send({
      title: "asldkfj",
      price: 20,
    });

  await request(app)
    .patch(`/api/v1/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 20,
    })
    .expect(400);

  await request(app)
    .patch(`/api/v1/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "alskdfjj",
      price: -10,
    })
    .expect(400);
});

it("updates the ticket provided valid inputs", async () => {
  const cookie = global.login();

  const response = await request(app)
    .post("/api/v1/tickets")
    .set("Cookie", cookie)
    .send({
      title: "asldkfj",
      price: 20,
    });

  await request(app)
    .patch(`/api/v1/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "new title",
      price: 100,
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/v1/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual("new title");
  expect(ticketResponse.body.price).toEqual(100);
});

it("publishes an event", async () => {
  const cookie = global.login();

  const response = await request(app)
    .post("/api/v1/tickets")
    .set("Cookie", cookie)
    .send({
      title: "asldkfj",
      price: 20,
    });

  await request(app)
    .patch(`/api/v1/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "new title",
      price: 100,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
});

it("rejects updates if the ticket is reserved", async () => {
  const cookie = global.login();

  const response = await request(app)
    .post("/api/v1/tickets")
    .set("Cookie", cookie)
    .send({
      title: "asldkfj",
      price: 20,
    });

  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({ orderId: new Types.ObjectId().toHexString() });
  await ticket!.save();

  await request(app)
    .patch(`/api/v1/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "new title",
      price: 100,
    })
    .expect(400);
});
