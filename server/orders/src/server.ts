import { natsWrapper } from "./nats-wrapper";
import { app } from "./app";
import connectDB from "./db";
import { TicketCreatedListener } from "./evemts-handler/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./evemts-handler/listeners/ticket-updated-listener";
import { ExpirationCompletedListener } from "./evemts-handler/listeners/expiration-completed-listener";
import { PaymentCreatedListener } from "./evemts-handler/listeners/payment-created-listener";
import { Subjects } from "@alibabatickets/common";

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
  const clientId = process.env.NATS_CLIENT_ID;
  const url = process.env.NATS_URL;
  const PORT = process.env.PORT || 3003;
  try {
    await natsWrapper.connect(clientId, url);
    await natsWrapper.createStream("tickets", [
      Subjects.TicketCreated,
      Subjects.TicketUpdated,
    ]);
    await natsWrapper.createStream("orders", [
      Subjects.OrderCreated,
      Subjects.OrderCancelled,
    ]);
    await natsWrapper.createStream("payments", [Subjects.PaymentCreated]);
    await natsWrapper.createStream("expirations", [
      Subjects.ExpirationComplete,
    ]);
    natsWrapper.onClose(() => {
      console.log("NATS connection closed!");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.close());
    process.on("SIGTERM", () => natsWrapper.close());

    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompletedListener(natsWrapper.client).listen();
    new PaymentCreatedListener(natsWrapper.client).listen();
    await connectDB(uri);
  } catch (e) {}
  app.listen(PORT, () => console.log(`Listen to port 3003🚀🚀🚀`));
})();
