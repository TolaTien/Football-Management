import { Router } from "express";
import { authAdmin, authUser } from "../../middlewares/auth.middleware.js";
import Statistic from "./statistic.controller.js";

export const statisticRouters: Router = Router();

statisticRouters.get('/pitch-revenue', authUser, authAdmin, Statistic.getMonthlyRevenue);
statisticRouters.get('/top-spenders', authUser, Statistic.getTopSpenders);
statisticRouters.get('/system-overview', authUser, authAdmin, Statistic.getSystemOverview);
statisticRouters.get('/export-revenue', authUser, authAdmin, Statistic.exportFileExcel);
