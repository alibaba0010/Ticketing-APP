import { JetStreamClient, JsMsg, StringCodec } from "nats";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  abstract subject: T["subject"];
  abstract queueGroupName: string;
  abstract onMessage(data: T["data"], msg: JsMsg): void;
  protected client: JetStreamClient;
  protected ackWait = 5 * 1000;

  constructor(client: JetStreamClient) {
    this.client = client;
  }

  listen() {
    (async () => {
      try {
        const subscription = await this.client.subscribe(this.subject, {
          durable: this.queueGroupName,
          // Request manual acknowledgement from subscribers so handlers control ack
          manualAck: true,
          // ack wait in milliseconds
          ack_wait: this.ackWait,
          // options are intentionally loose here for compatibility
        } as any);

        for await (const msg of subscription) {
          console.log(
            `Message received: ${this.subject} in ${this.queueGroupName}`
          );

          const parsedData = this.parseMessage(msg as JsMsg);
          this.onMessage(parsedData, msg as JsMsg);
        }
      } catch (err) {
        console.error("Error handling JetStream subscription:", err);
      }
    })();
  }

  parseMessage(msg: JsMsg) {
    const data = (msg as any).data ?? (msg as any)._raw ?? new Uint8Array();
    const sc = StringCodec();
    const str = typeof data === "string" ? data : sc.decode(data as Uint8Array);
    return JSON.parse(str || "{}");
  }
}
