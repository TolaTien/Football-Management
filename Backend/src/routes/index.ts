import { Router } from "express";
import { authRouters } from "../modules/auth/auth.route.js";
import { userRouters } from "../modules/users/users.route.js";
import { pitchRouters } from "../modules/pitch/pitch.route.js";
import { bookingRouters } from "../modules/booking/booking.route.js";
import { adminRouters } from "../modules/admin/admin.route.js";
import { statisticRouters } from "../modules/statistic/statistic.route.js";
import { servicesRouters } from "../modules/services/services.route.js";
import { postsRouters } from "../modules/posts/posts.route.js";

export const Routers: Router = Router();

Routers.use('/auth', authRouters);
Routers.use('/user', userRouters);
Routers.use('/pitch', pitchRouters);
Routers.use('/booking', bookingRouters);
Routers.use('/admin', adminRouters);
Routers.use('/statistic', statisticRouters);
Routers.use('/services', servicesRouters);
Routers.use('/posts', postsRouters);
