import { MongoMemoryServer } from "mongodb-memory-server";
import { Types, connect, connection } from "mongoose";
import jwt from "jsonwebtoken";

declare global {
  namespace NodeJS {
    interface Global {
      signin(id?: string): string[];
    }
  }
}

jest.mock("../nats-wrapper");

process.env.STRIPE_KEY = "sk_test_51NlAseIBBPhIYhH7WN59oFlMrQRHWpY1OQpjWC2HReRKOjXK0dnlKlVPB5G6dCEtVbDZLXm8e4IaDpldBwt4D5rR00mPDEMRTk";

let mongo: MongoMemoryServer;
beforeAll(async () => {
  process.env.JWT_SECRET = "asdfasdf";
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  mongo = await MongoMemoryServer.create();
  console.log("mongo.....: ", mongo);

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

global.signin = (id?: string) => {
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
