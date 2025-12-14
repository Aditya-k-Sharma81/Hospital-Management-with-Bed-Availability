import express from 'express';
import {doctorList, doctorLogin, doctorAppointmentList, Reciept} from '../controllers/doctorController.js'
import authDoctor from '../middlewares/authDoctor.js';
const doctorRouter = express.Router();

doctorRouter.get("/list", doctorList);
doctorRouter.post("/login", doctorLogin);

doctorRouter.get("/doctor-appointment",authDoctor, doctorAppointmentList);

doctorRouter.post("/reciept", Reciept);
export default doctorRouter;