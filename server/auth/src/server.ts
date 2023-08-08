import { app } from "./app";
import connectDB from "./db";
(async () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET_KEY must be defined");
  }
  if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL must be included");
  }
  const uri = process.env.MONGO_URL;
  try {
    await connectDB(uri);
  } catch (e) {}
  app.listen(3001, () => console.log("Listen to port 3001"));
})();

console.log("In Auth");
