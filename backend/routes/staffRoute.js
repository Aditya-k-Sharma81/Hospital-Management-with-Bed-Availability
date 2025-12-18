import { staffLogin, getAllBeds, getAllUsers, allocateBed, getAllBedReceipts, dischargePatient } from '../controllers/staffController.js';
import express from 'express'
const staffRoute = express.Router();
staffRoute.post("/staff-login", staffLogin);
staffRoute.get("/get-all-beds", getAllBeds);
staffRoute.get("/get-all-users", getAllUsers);
staffRoute.post("/allocate-bed", allocateBed);
staffRoute.get("/get-all-bed-receipts", getAllBedReceipts);
staffRoute.post("/discharge-patient", dischargePatient);

export default staffRoute;