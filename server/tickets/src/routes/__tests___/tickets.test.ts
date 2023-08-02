import request from "supertest";
import { app } from "../../app";

it('implements optimistic concurrency control', async (done) => {
   // Create an instance of a ticket
   const ticket = Ticket.build({
     title: 'concert',
     price: 5,
     userId: '123',
   });