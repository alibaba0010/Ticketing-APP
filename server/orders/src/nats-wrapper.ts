import {
  connect,
  NatsConnection,
  JetStreamClient,
  JetStreamManager,
} from "nats";

class NatsWrapper {
  private _nc?: NatsConnection;
  private _client?: JetStreamClient;

  get client() {
    if (!this._client) {
      throw new Error("Cannot access NATS client before connecting");
    }
    return this._client;
  }
  async connect(clientId: string, url: string) {
    try {
      this._nc = await connect({
        servers: url,
        name: clientId,
      });
      this._client = this._nc.jetstream();
    } catch (error) {
      console.log("Error connecting to NATS in order: ", error);
    }
  }
  async jetstreamManager(): Promise<JetStreamManager> {
    if (!this._nc) {
      throw new Error("Cannot access NATS client before connecting");
    }
    return this._nc.jetstreamManager();
  }
  async createStream(streamName: string, subjects: string[]) {
    const jsm = await this.jetstreamManager();

    // DEBUG: List all streams
    const streams = await jsm.streams.list().next();
    console.log(
      "Existing streams:",
      streams.map((s) => s.config.name)
    );

    try {
      await jsm.streams.info(streamName);
      console.log(`Stream '${streamName}' already exists. Updating...`);
      await jsm.streams.update(streamName, {
        subjects: subjects,
      });
      console.log(
        `Updated stream '${streamName}' with subjects: ${subjects.join(", ")}`
      );
    } catch (err) {
      console.log(`Stream '${streamName}' not found. Creating...`);
      await jsm.streams.add({
        name: streamName,
        subjects: subjects,
      });
      console.log(
        `Created stream '${streamName}' with subjects: ${subjects.join(", ")}`
      );
    }
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
