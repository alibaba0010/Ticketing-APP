import { MongoMemoryServer } from "mongodb-memory-server";
import jwt from "jsonwebtoken";
import { Types, connect, connection } from "mongoose";
jest.mock("../nats-wrapper");
import { beforeAll, afterAll, beforeEach, jest } from "@jest/globals";

declare global {
  function login(): string[];
}
let mongo: MongoMemoryServer;

const originalStdoutWrite = process.stdout.write;
const originalStderrWrite = process.stderr.write;

process.stdout.write = (chunk: any, ...args: any[]) => {
  if (typeof chunk === "string" && chunk.includes("MongoMS")) return true;
  return originalStdoutWrite.call(process.stdout, chunk, ...args);
};

process.stderr.write = (chunk: any, ...args: any[]) => {
  if (typeof chunk === "string" && chunk.includes("MongoMS")) return true;
  return originalStderrWrite.call(process.stderr, chunk, ...args);
};
beforeAll(async () => {
  process.env.JWT_SECRET = "asdfasdf";
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  mongo = await MongoMemoryServer.create({
    instance: {
      dbName: "test-db", // Your desired database name
    },
  }); // Assign the MongoMemoryServer instance to the global mongo variable

  const mongoUri = mongo.getUri(); // Get the URI from the MongoMemoryServer instance
  await connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await connection.db!.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await connection.close();
});

global.login = () => {
  // Build a JWT payload.  { id, email }
  const payload = {
    id: new Types.ObjectId().toHexString(),
    email: "test@test.com",
  };

  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_SECRET!);

  // Build session Object. { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");
  // return a string thats the cookie with the encoded data
  return [`session=${base64}`];
};
