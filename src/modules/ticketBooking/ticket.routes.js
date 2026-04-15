import express from "express";
import * as ticketController from "./ticket.controller.js";
import  validate  from "../../common/middleware/validate.middleware.js";
import TicketDto from "./dto/ticket.dto.js";
import { authenticate } from "../auth/auth.middleware.js";

const router = express.Router();

router.get("/seats", ticketController.getAllSeats);

router.put("/:id/:name",validate(TicketDto), authenticate, ticketController.bookSeat);

export default router;