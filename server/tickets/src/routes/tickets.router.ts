import {
  authentication,
  currentUser,
  validateRequest,
  validateTicket,
} from "@alibabatickets/common";
import { Request, Response, Router } from "express";
import {
  createTicket,
  getTicketWithId,
  updateTicket,
  getTickets,
} from "../controllers/tickets.controller";

const ticketRouter = Router();

ticketRouter
  .post(
    "/",
    currentUser,
    authentication,
    validateTicket,
    validateRequest,
    createTicket
  )
  .get("/", getTickets)
  .get("/:id", getTicketWithId)
  .patch("/:id", currentUser, authentication, validateTicket, updateTicket);
export default ticketRouter;
