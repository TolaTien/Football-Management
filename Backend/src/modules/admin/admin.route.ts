import { Router } from "express";
import { authAdmin, authUser } from "../../middlewares/auth.middleware.js";
import Admin from './admin.controller.js'

export  const adminRouters: Router = Router();

adminRouters.post('/approve-request-user', authUser, authAdmin, Admin.approveRequestUser);
adminRouters.post('/cancel-booking-admin', authUser, authAdmin, Admin.cancelBookingForAdmin);
adminRouters.post('/refund-user', authUser, authAdmin, Admin.refundForUser);
adminRouters.post('/verify-payment-user', authUser, authAdmin, Admin.verifyPaymentOfUser);
adminRouters.get('/get-all-history-user/:userId', authUser, authAdmin, Admin.getAllHistoryOfUser);




import AdminUserController from "./admin-user.controller.js";


adminRouters.use(authUser, authAdmin);

adminRouters.get("/users", AdminUserController.getAll);
adminRouters.get("/users/:id", AdminUserController.getById);
adminRouters.post("/users", AdminUserController.create);
adminRouters.put("/users/:id", AdminUserController.update);
adminRouters.delete("/users/:id", AdminUserController.delete);
