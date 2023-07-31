import request from "supertest";
import { app } from "../../app";

// *******SIGNUP*****
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

//**********LOGIN*************

it("fails with 400 when a email that does not exist is supplied", async () => {
  await request(app)
    .post("/api/v1/users/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(400);
});

it("fails when an incorrect password is supplied", async () => {
  await request(app)
    .post("/api/v1/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  await request(app)
    .post("/api/v1/users/signin")
    .send({
      email: "test@test.com",
      password: "aslkdfjalskdfj",
    })
    .expect(400);
});

it("responds with a cookie when given valid credentials", async () => {
  await request(app)
    .post("/api/v1/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/v1/users/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});

//**********SIGN OUT*************
it("clears the cookie after signing out", async () => {
  await request(app)
    .post("/api/v1/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/v1/users/signout")
    .send({})
    .expect(200);

  expect(response.get("Set-Cookie")[0]).toEqual(
    "express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly" //you can also use isDefined()
  );
});

//**********CURRENT USER*************
it("responds with details about the current user", async () => {
  const cookie = await global.signin();

  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual("test@test.com");
});

it("responds with null if not authenticated", async () => {
  const response = await request(app)
    .get("/api/v1/users/currentuser")
    .send()
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});
