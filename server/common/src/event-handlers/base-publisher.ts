import { NatsConnection, StringCodec } from "nats";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T["subject"];
  protected client: NatsConnection;
  protected sc = StringCodec();

  constructor(client: NatsConnection) {
    this.client = client;
  }

  async publish(data: T["data"]): Promise<void> {
    const payload = this.sc.encode(JSON.stringify(data));
    try {
      this.client.publish(this.subject, payload);
      console.log("Event published to subject", this.subject);
    } catch (err) {
      console.error("Publish error:", err);
      throw err;
    }
  }
}
