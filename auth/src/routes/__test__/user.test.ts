import request from "supertest";
import { app } from "../../app";

it("returns a 201 on successful signup", async () => {
  return request(app)
    .post("/api/v1/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
}, 10000);

it("returns a 400 with an invalid email", async () => {
  return request(app)
    .post("/api/v1/users/signup")
    .send({
      email: "alskdflaskjfd",
      password: "password",
    })
    .expect(400);
}, 10000);

it("returns a 400 with an invalid password", async () => {
  return request(app)
    .post("/api/v1/users/signup")
    .send({
      email: "alskdflaskjfd",
      password: "p",
    })
    .expect(400);
}, 10000);

it("returns a 400 with missing email or password", async () => {
  await request(app)
    .post("/api/v1/users/signup")
    .send({
      email: "test@test.com",
    })
    .expect(400);

  await request(app)
    .post("/api/v1/users/signup")
    .send({
      password: "alskjdf",
    })
    .expect(400);
}, 10000);

it("sets a cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/v1/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
}, 10000);
