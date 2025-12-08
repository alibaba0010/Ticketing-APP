import mongoose from "mongoose";

const { connection, set, connect } = mongoose;
console.clear();
const sanitizeUri = (uri: string) => {
  if (!uri) return uri;
  let s = uri.trim();
  // remove surrounding single/double quotes
  s = s.replace(/^['"]+|['"]+$/g, "");
  // remove trailing semicolon if present
  s = s.replace(/;$/, "");
  return s;
};

const connectDB = async (uri: string) => {
  // const sanitized = sanitizeUri(uri);
  try {
    connection.once("open", () => console.log("MongoDB connected"));
    connection.on("error", (err) =>
      console.error("MongoDB connection error:", err)
    );
    set("strictQuery", false);
    await connect(uri);
  } catch (e) {
    console.error("Failed to connect to MongoDB:", e);
    throw e;
  }
};

export default connectDB;
