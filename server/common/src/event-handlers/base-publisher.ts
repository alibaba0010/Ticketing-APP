import { JetStreamClient, StringCodec } from "nats";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T["subject"];
  protected client: JetStreamClient;

  constructor(client: JetStreamClient) {
    this.client = client;
  }

  async publish(data: T["data"]): Promise<void> {
    const sc = StringCodec();
    try {
      await this.client.publish(
        this.subject,
        sc.encode(JSON.stringify(data)) as any
      );
      console.log("Event published to subject", this.subject);
    } catch (err) {
      console.error("Failed to publish event", err);
      throw err;
    }
  }
}
