// src/modules/ticketBooking/ticket.controller.js
import * as ticketService from "./ticket.service.js";
import ApiError  from "../../common/utils/api-error.js";
import ApiResponse from "../../common/utils/api-response.js";

const getAllSeats = async (req, res) => {
  try {
    const seats = await ticketService.getAllSeatsService();
    ApiResponse.ok(res, "Seats retrieved successfully", seats);
  } catch (error) {
    ApiError.forbidden(res, error.message, 500);
  }
};


const bookSeat = async (req, res) => {
  try {
    const { id, name } = req.params; 

    const result = await ticketService.bookSeatService(Number(id), name);

    ApiResponse.ok(res, "Seat booked successfully", result);
  } catch (error) {
    ApiError.badRequest(res, error.message, 400);   
  }
};

export {
    getAllSeats,
    bookSeat
}
