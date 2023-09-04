import request from "supertest";
import { Schema, model, Types } from "mongoose";
import { it, expect } from "@jest/globals";

import { app } from "../../app";
import { Ticket } from "../../models/tickets.mongo";
import { natsWrapper } from "../../nats-wrapper";

// *******CREATING A TICKET*****
it("has a route handler listening to /ap1/v1/tickets for post requests", async () => {
  const response = await request(app).post("/ap1/v1/v1/tickets").send({});

  expect(response.status).toEqual(404);
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




