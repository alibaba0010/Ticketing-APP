import { JetStreamClient, JsMsg, StringCodec, consumerOpts } from "nats";
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
        const options = consumerOpts();
        const durableName = `${this.queueGroupName}-${this.subject
          .split(":")
          .join("-")
          .split(".")
          .join("-")}`;
        options.durable(durableName); // durable consumer
        options.queue(this.queueGroupName); // queue group (work-sharing)
        options.manualAck(); // manual ack handling
        options.ackExplicit(); // require explicit ack
        options.ackWait(this.ackWait); // redelivery timeout
        options.deliverAll(); // deliver all available messages
        options.deliverTo(`inbox.${this.subject}.${this.queueGroupName}`);

        const subscription = await this.client.subscribe(this.subject, options);

        for await (const msg of subscription) {
          console.log(
            `Message received: ${this.subject} in ${this.queueGroupName} with sequence ${msg.seq}`
          );

          const parsedData = this.parseMessage(msg);
          this.onMessage(parsedData, msg);
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
