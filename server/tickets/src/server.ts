import { app } from "./app";
import connectDB from "./db";
import { OrderCancelledListener } from "./events-handler/listeners/order-cancelled-listener";
import { OrderCreatedListener } from "./events-handler/listeners/order-created-listener";
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
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET_KEY must be defined");
  }

  if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL must be included");
  }
  const uri = process.env.MONGO_URL;

  const clientId = process.env.NATS_CLIENT_ID;
  const url = process.env.NATS_URL;
  const PORT = process.env.PORT || 3002;
  try {
    await natsWrapper.connect(clientId, url);
    await natsWrapper.createStream("tickets", [
      Subjects.TicketCreated,
      Subjects.TicketUpdated,
    ]);

    natsWrapper.onClose(() => {
      console.log("NATS connection closed!");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.close());
    process.on("SIGTERM", () => natsWrapper.close());

    new OrderCreatedListener(natsWrapper.client);
    new OrderCancelledListener(natsWrapper.client);
    await connectDB(uri);
  } catch (e) {
    console.error("Error starting server:", e);
    process.exit(1); // Exit so K8s can restart the pod
  }
  app.listen(PORT, () => console.log(`Listen to port 3002  🚀🚀`));
})();
