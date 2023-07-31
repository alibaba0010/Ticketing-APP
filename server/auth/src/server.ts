import { app } from "./app";
import connectDB from "./db";

(async () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET_KEY must be defined");
  }
  try {
    await connectDB();
  } catch (e) {}
  app.listen(3001, () => console.log("Listen to port 3001"));
})();
