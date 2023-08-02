import { Request, Response, Router } from "express";
// import { Ticket } from '../models/ticket';

const ticketRouter = Router();

ticketRouter.get("/", async (req: Request, res: Response) => {
  const tickets = await Ticket.find({
    orderId: undefined,
  });

  res.send(tickets);
});
export default ticketRouter;
