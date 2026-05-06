import { Router } from "express";
import { authRouters } from "../modules/auth/auth.route.js";
import { userRouters } from "../modules/users/users.route.js";
import { pitchRouters } from "../modules/pitch/pitch.route.js";
import { bookingRouters } from "../modules/booking/booking.route.js";

export const Routers: Router = Router();

Routers.use('/auth', authRouters);
Routers.use('/user', userRouters);
Routers.use('/pitch', pitchRouters);
Routers.use('/booking', bookingRouters);