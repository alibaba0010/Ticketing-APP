import { MongoMemoryServer } from "mongodb-memory-server";
import jwt from "jsonwebtoken";
import { Types, connect, connection, disconnect } from "mongoose";
jest.mock("../nats-wrapper");

declare global {
  namespace NodeJS {
    interface Global {
      login(): string[];
    }
  }
}

let mongo: MongoMemoryServer;
beforeAll(async () => {
  process.env.JWT_SECRET = "asdfasdf";
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  mongo = await MongoMemoryServer.create();

  // mongo = await MongoMemoryServer.create({
  // instance: {
  //   dbName: "test-db", // Your desired database name
  //   storageEngine: "wiredTiger", // Optional: Specify the storage engine
  //   // launchTimeout: 50000,
  // },
  // }); // Assign the MongoMemoryServer instance to the global mongo variable
  await connect(mongo.getUri(), { dbName: "test-db" });

  // const mongoUri = mongo.getUri(); // Get the URI from the MongoMemoryServer instance
  // await connect(mongoUri);
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

global.login = () => {
  // Build a JWT payload.  { id, email }
  const payload = {
    id: new Types.ObjectId().toHexString(),
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
  console.log("base64: ", base64);
  // return a string thats the cookie with the encoded data
  return [`express:sess=${base64}`];
};
