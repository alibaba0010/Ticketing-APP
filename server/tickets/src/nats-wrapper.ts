import { connect, NatsConnection, JetStreamClient } from "nats";
console.clear();
class NatsWrapper {
  private _nc?: NatsConnection;
  // Expose a thin, compatible client API used across the repo/tests
  private _client?: any;

  get client(): JetStreamClient {
    if (!this._client) {
      throw new Error("Cannot access NATS client before connecting");
    }
    return this._client;
  }

  async connect(_clusterId: string, clientId: string, url: string) {
    console.log(`Connecting to NATS... clientId: ${clientId} , url: ${url}`); // "http://localhost:4222"
    // const NATS_URL = "http://localhost:4222";
    try {
      this._nc = await connect({ servers: [url], name: clientId });
    } catch (error) {
      console.log(error);
    }

    this._client = this._nc!.jetstreamManager();

    console.log("Successfully connected to NATS server");
  }

  // Close the underlying NATS connection
  close() {
    this._nc?.close();
  }

  // Register a callback for connection close
  onClose(cb: () => void) {
    this._nc?.closed().then(() => cb());
  }
}

export const natsWrapper = new NatsWrapper();
