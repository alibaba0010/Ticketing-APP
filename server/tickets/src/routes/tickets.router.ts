import { authentication, validateRequest, validateTicket } from "@app/common";
import { Request, Response, Router } from "express";
import { createTicket } from "../controllers/tickets.controller";

const ticketRouter = Router();

ticketRouter.get(
  "/",
  validateTicket,
  validateRequest,
  authentication,
  createTicket
);
export default ticketRouter;
