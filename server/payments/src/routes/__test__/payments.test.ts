import request from "supertest";
import { OrderStatus } from "@alibabatickets/common";
import { app } from "../../app";
import { Order } from "../../models/orders-payments";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment.mongo";
import { Types } from "mongoose";

it("returns a 404 when purchasing an order that does not exist", async () => {
  await request(app)
    .post("/api/v1/payments")
    .set("Cookie", global.signin())
    .send({
      token: "asldkfj",
      orderId: new Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("returns a 401 when purchasing an order that doesnt belong to the user", async () => {
  const order = Order.build({
    id: new Types.ObjectId().toHexString(),
    userId: new Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post("/api/v1/payments")
    .set("Cookie", global.signin())
    .send({
      token: "asldkfj",
      orderId: order.id,
    })
    .expect(401);
});

it("returns a 400 when purchasing a cancelled order", async () => {
  const userId = new Types.ObjectId().toHexString();
  const order = Order.build({
    id: new Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  });
  await order.save();

  await request(app)
    .post("/api/v1/payments")
    .set("Cookie", global.signin(userId))
    .send({
      orderId: order.id,
      token: "asdlkfj",
    })
    .expect(400);
});

it("returns a 201 with valid inputs", async () => {
  const userId = new Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 100000);
  const order = Order.build({
    id: new Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post("/api/v1/payments")
    .set("Cookie", global.signin(userId))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(201);

  const stripeCharges = await stripe.charges.list({ limit: 50 });
  const stripeCharge = stripeCharges.data.find((charge: { amount: number }) => {
    return charge.amount === price * 100;
  });

  expect(stripeCharge).toBeDefined();
  expect(stripeCharge!.currency).toEqual("usd");

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id,
  });
  expect(payment).not.toBeNull();
});
