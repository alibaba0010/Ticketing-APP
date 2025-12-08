import { NatsConnection, Msg, StringCodec } from "nats";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  abstract subject: T["subject"];
  abstract queueGroupName: string;
  abstract onMessage(data: T["data"], msg: Msg): void;
  protected client: NatsConnection;
  protected sc = StringCodec();

  constructor(client: NatsConnection) {
    this.client = client;
  }

  listen() {
    const subscription = this.client.subscribe(this.subject, {
      queue: this.queueGroupName,
    });

    (async () => {
      for await (const msg of subscription) {
        try {
          console.log(
            `Message received: ${this.subject} / ${this.queueGroupName}`
          );
          const parsedData = this.parseMessage(msg);
          this.onMessage(parsedData, msg);
        } catch (err) {
          console.error("Listener onMessage error:", err);
        }
      }
    })();
  }

  parseMessage(msg: Msg) {
    const data = this.sc.decode(msg.data);
    return JSON.parse(data);
  }
}
