import { OrderCreatedListener } from "./events-handler/listeners/order-created-listener";
import { natsWrapper } from "./nats-wrapper";
import { Subjects } from "@alibabatickets/common";

const start = async () => {
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }
  if (!process.env.REDIS_HOST) {
    throw new Error("REDIS_HOST must be defined");
  }
  const clusterId = process.env.NATS_CLUSTER_ID;
  const clientId = process.env.NATS_CLIENT_ID;
  const url = process.env.NATS_URL;
  const streamName = "ticketing";
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
  } catch (err) {
    console.error(err);
  }
};

start();
