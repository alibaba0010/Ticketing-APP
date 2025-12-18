import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();
if (!process.env.STRIPE_KEY) {
  throw new Error("STRIPE_KEY is not defined in environment variables");
}
export const stripe = new Stripe(process.env.STRIPE_KEY, {
  apiVersion: "2025-11-17.clover",
});
