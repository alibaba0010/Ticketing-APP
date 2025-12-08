import { Stan } from "node-nats-streaming";
import nats, { connect } from "nats";
console.clear();

class NatsWrapper {
  private _client?: Stan;
  get client() {
    if (!this._client) {
      throw new Error("Cannot access NATS client before connecting");
    }
    return this._client;
  }
  connect(clusterId: string, clientId: string, url: string) {
    console.log(
      `Connecting to NATS... clusterId: ${clusterId} , clientId: ${clientId} , url: ${url}`
    );
    // this._client = connect(clusterId, clientId, { url });
    const nc = connect({ servers: [url] });
    const js = nc.jetstream();

    console.log("Successfully connected to NATS JetStream via nats-srv!");

    return new Promise<void>((resolve, reject) => {
      this.client.on("connect", () => {
        console.log("Connected to Jet Stream");
        resolve();
      });
      this.client.on("error", (err) => reject(err));
    });
  }
}
export const natsWrapper = new NatsWrapper();
