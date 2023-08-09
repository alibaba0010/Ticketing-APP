import { authentication, validateRequest, validateTicket } from "@sgtickets/common";
import { Request, Response, Router } from "express";
import {
  createTicket,
  getTicketWithId,
  updateTicket,
} from "../controllers/tickets.controller";

const ticketRouter = Router();

ticketRouter
  .post("/", validateTicket, validateRequest, authentication, createTicket)
  .get("/:id", authentication, getTicketWithId)
  .patch("/:id", validateTicket, authentication, updateTicket);
export default ticketRouter;
