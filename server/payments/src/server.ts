import { app } from "./app";
import connectDB from "./db";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { natsWrapper } from "./nats-wrapper";
import { Subjects } from "@alibabatickets/common";

import dotenv from "dotenv";
dotenv.config();

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

  if (!process.env.PORT) {
    throw new Error("PORT must be included");
  }

  const uri = process.env.MONGO_URL;
  const clusterId = process.env.NATS_CLUSTER_ID;
  const clientId = process.env.NATS_CLIENT_ID;
  const url = process.env.NATS_URL;
  const PORT = process.env.PORT || 3004;
  const streamName = process.env.STREAM_NAME || "ticketing";

  try {
    await natsWrapper.connect(clientId, url);
    await natsWrapper.createStream(
      streamName,
      Object.values(Subjects) as string[]
    );
    natsWrapper.onClose(() => {
      console.log("NATS connection closed!");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.close());
    process.on("SIGTERM", () => natsWrapper.close());

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();

    await connectDB(uri);
  } catch (e) {}
  app.listen(PORT, () => console.log(`Listen to port ${PORT} 🚀🚀🚀🚀`));
})();
