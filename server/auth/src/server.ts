import { app } from "./app";
import connectDB from "./db";
import dotenv from "dotenv";
dotenv.config();
(async () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET_KEY must be defined");
  }
  if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL must be included");
  }
  const PORT = process.env.PORT || 3001;
  try {
    const uri = process.env.MONGO_URL;
    await connectDB(uri!);
    app.listen(PORT, () => console.log(`Listening on port ${PORT} 🚀`));
  } catch (e) {
    console.error("Error starting server:", e);
    process.exit(1);
  }
})();
