import {
  authentication,
  validateRequest,
  validateOrder,
} from "@alibabatickets/common";
import { Router } from "express";
import {
  createOrder,
  getOrderWithId,
  getOrders,
  deleteOrderWithId,
} from "../controllers/orders.controller";

const ticketRouter = Router();

ticketRouter
  .get("/:id", authentication, getOrderWithId)
  .get("/", authentication, getOrders)
  .post("/", authentication, validateOrder, validateRequest, createOrder)
  // .patch("/:id",authentication, validateOrder,  updateTicket)
  .delete("/:id", authentication, deleteOrderWithId);
export default ticketRouter;
