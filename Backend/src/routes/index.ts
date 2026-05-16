import { Router } from "express";
import { authRouters } from "../modules/auth/auth.route.js";
import { userRouters } from "../modules/users/users.route.js";
import { pitchRouters } from "../modules/pitch/pitch.route.js";
import { bookingRouters } from "../modules/booking/booking.route.js";
import { adminRouters } from "../modules/admin/admin.route.js";
import { statisticRouters } from "../modules/statistic/statistic.route.js";
import { serviceRouters } from "../modules/services/services.route.js";
import { commentRouters } from "../modules/comments/comments.route.js";
import { notificationRouters } from "../modules/notification/notification.route.js";

export const Routers: Router = Router();

Routers.use('/auth', authRouters);
Routers.use('/user', userRouters);
Routers.use('/pitch', pitchRouters);
Routers.use('/booking', bookingRouters);
Routers.use('/admin', adminRouters);
Routers.use('/statistic', statisticRouters);
Routers.use('/services', serviceRouters);
Routers.use('/comments', commentRouters);
Routers.use('/notification', notificationRouters);
