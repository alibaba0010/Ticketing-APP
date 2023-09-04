import { MongoMemoryServer } from "mongodb-memory-server";
import { Types, connect, connection } from "mongoose";
import jwt from "jsonwebtoken";
import { beforeAll, afterAll, beforeEach, jest } from "@jest/globals";

// declare global {
//   namespace NodeJS {
//     interface Global {
//       login(id?: string): string[];
//     }
//   }
// }
declare global {
  function login(id?: string): string[];
}
jest.mock("../nats-wrapper");


let mongo: MongoMemoryServer;
beforeAll(async () => {
  process.env.JWT_SECRET = "asdfasdf";
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  mongo = await MongoMemoryServer.create();

  await connect(mongo.getUri(), { dbName: "test-db" });
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await connection.close();
});

global.login = (id?: string) => {
  // Build a JWT payload.  { id, email }
  const payload = {
    id: id || new Types.ObjectId().toHexString(),
    email: "test@test.com",
  };

  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session Object. { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  // return a string thats the cookie with the encoded data
  return [`express:sess=${base64}`];
};
