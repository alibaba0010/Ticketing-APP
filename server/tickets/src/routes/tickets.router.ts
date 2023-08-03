import { authentication, validateRequest, validateTicket } from "@app/common";
import { Request, Response, Router } from "express";
import {
  createTicket,
  getTicketWithId,
} from "../controllers/tickets.controller";

const ticketRouter = Router();

ticketRouter
  .post("/", validateTicket, validateRequest, authentication, createTicket)
  .get("/:id", authentication, getTicketWithId);
export default ticketRouter;
