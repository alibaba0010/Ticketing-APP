import { JetStreamClient, StringCodec, PubAck } from "nats";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}
console.log("In base publisher");
export abstract class Publisher<T extends Event> {
  abstract subject: T["subject"];
  protected client: JetStreamClient;

  constructor(client: JetStreamClient) {
    this.client = client;
  }

  async publish(data: T["data"]): Promise<void> {
    console.log("In base publisher with data: ", data);
    const sc = StringCodec();
    try {
      // const pubAck: PubAck = await this.client.publish(
      //   this.subject,
      //   sc.encode(JSON.stringify(data)) as any
      // );
      // const sequence = await pubAck.seq;
      // console.log(
      //   `Event published to subject ${this.subject} with sequence ${sequence}`
      // );
      console.log("Publishing event to subject", this.subject);
      console.log("Event data", data);
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
