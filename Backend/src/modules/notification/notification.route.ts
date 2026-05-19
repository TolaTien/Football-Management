import { Router } from "express";
import { authUser } from "../../middlewares/auth.middleware.js";
import Notification from './notification.controller.js';

export const notificationRouters: Router = Router();

notificationRouters.get('/get-all-notification', authUser, Notification.getAllNotification);
notificationRouters.patch('/mark-read/:id', authUser, Notification.markRead);
notificationRouters.patch('/mark-read-all', authUser, Notification.markReadAll);
