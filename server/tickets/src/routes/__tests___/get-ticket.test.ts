import { app } from "../../app";
import { Types } from "mongoose";
import request from "supertest";

// *******GETTING A TICKET WITH ITS ID*****
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
