import { Queue, Worker } from "bullmq";
import { ExpirationCompletedPublisher } from "../events-handler/publishers/expiration-complete-publisher";
import { natsWrapper } from "../nats-wrapper";

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>("order:expiration", {
  connection: {
    host: process.env.REDIS_HOST,
  },
});

const expirationWorker = new Worker<Payload>(
  "order:expiration",
  async (job) => {
    new ExpirationCompletedPublisher(natsWrapper.client).publish({
      orderId: job.data.orderId,
    });
  },
  {
    connection: {
      host: process.env.REDIS_HOST,
    },
  }
);

export { expirationQueue };
