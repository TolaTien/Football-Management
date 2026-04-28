import { Router } from "express";
import { authAdmin, authUser } from "../../middlewares/auth.middleware.js";
import Pitch from './pitch.controller.js'
export const pitchRouters: Router = Router();

pitchRouters.get('/', authUser, Pitch.getAllPitch);
pitchRouters.post('/create-pitch', authUser, authAdmin, Pitch.addPitch);
