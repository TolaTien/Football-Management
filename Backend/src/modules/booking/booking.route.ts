import { Router } from "express";
import { authUser } from "../../middlewares/auth.middleware.js";
import Booking from './booking.controller.js';

export const bookingRouters: Router = Router();

bookingRouters.post('/booking-pitch-user', authUser, Booking.bookPitchForUser);
bookingRouters.post('/payment-user', authUser, Booking.partialPayment);
bookingRouters.post('/cancel-booking-user', authUser, Booking.cancelBookingForUser);
