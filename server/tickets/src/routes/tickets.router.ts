import {
  authentication,
  validateRequest,
  validateTicket,
} from "@alibabatickets/common";
import { Request, Response, Router } from "express";
import {
  createTicket,
  getTicketWithId,
  updateTicket,
} from "../controllers/tickets.controller";

const ticketRouter = Router();

ticketRouter
  .post("/", authentication, validateTicket, validateRequest, createTicket)
  .get("/:id", authentication, getTicketWithId)
  .patch("/:id", authentication, validateTicket, updateTicket);
export default ticketRouter;
