import { Router } from "express";
import { authAdmin, authUser } from "../../middlewares/auth.middleware.js";
import Admin from './admin.controller.js'

export  const adminRouters: Router = Router();

adminRouters.post('/approve-request-user', authUser, authAdmin, Admin.approveRequestUser);
adminRouters.post('/cancel-booking-admin', authUser, authAdmin, Admin.cancelBookingForAdmin);
adminRouters.post('/refund-user', authUser, authAdmin, Admin.refundForUser);
adminRouters.get('/get-all-history-user/:userId', authUser, authAdmin, Admin.getAllHistoryOfUser);