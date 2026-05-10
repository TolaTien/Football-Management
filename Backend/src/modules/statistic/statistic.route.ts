import { Router } from "express";
import { authAdmin, authUser } from "../../middlewares/auth.middleware.js";
import Statistic from "./statistic.controller.js";

export const statisticRouters: Router = Router();

statisticRouters.get('/monthly-statistic', authUser, authAdmin, Statistic.getMonthlyRevenue);
