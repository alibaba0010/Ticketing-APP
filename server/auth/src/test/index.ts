import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import { app } from "../app";
import mongoose from "mongoose";
import { beforeAll, afterAll, beforeEach } from "@jest/globals";

declare global {
  function signin(): Promise<string[]>;
}

let mongo: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_SECRET = "asdfasdf";
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  try {
    // Make sure there are no existing connections
    await mongoose.connection.close();
    await mongoose.disconnect();

    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri, {
      dbName: "test-db",
      autoCreate: true,
    });
  } catch (error) {
    console.error("Error in test setup:", error);
    throw error;
  }
});

beforeEach(async () => {
  const db = mongoose.connection.db;
  try {
    if (db) {
      const collections = await db.collections();
      for (let collection of collections) {
        await collection.deleteMany({});
      }
    }
  } catch (error) {
    console.error("Error in beforeEach:", error);
    throw error;
  }
});

afterAll(async () => {
  try {
    if (mongo) {
      await mongo.stop();
    }
    await mongoose.disconnect();
  } catch (error) {
    console.error("Error in test teardown:", error);
    throw error;
  }
});

global.signin = async (): Promise<string[]> => {
  const email = "test@test.com";
  const password = "password";

  const response = await request(app)
    .post("/api/v1/users/signup")
    .send({
      email,
      password,
    })
    .expect(201);

  const cookie = response.get("Set-Cookie");
  if (!cookie || !Array.isArray(cookie)) {
    throw new Error("Set-Cookie header is missing or not an array");
  }
  return cookie;
};
