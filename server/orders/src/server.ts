import { app } from "./app";
import connectDB from "./db";
// import { natsWrapper } from "./nats-wrapper";

(async () => {
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET_KEY must be defined");
  }

  if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL must be included");
  }
  const uri = process.env.MONGO_URL;
  const clusterId = process.env.NATS_CLUSTER_ID;
  const clientId = process.env.NATS_CLIENT_ID;
  const url = process.env.NATS_URL;
  try {
    // await natsWrapper.connect(clusterId, clientId, url);
    await connectDB(uri);
  } catch (e) {}
  app.listen(3003, () => console.log(`Listen to port 3003🚀🚀🚀`));
})();
