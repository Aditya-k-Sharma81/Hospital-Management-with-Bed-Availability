import express from 'express';
import { staffLogin, getAllBeds, getAllUsers, allocateBed } from '../controllers/staffController.js';

const staffRoute = express.Router();
staffRoute.post("/staff-login", staffLogin);
staffRoute.get("/get-all-beds", getAllBeds);
staffRoute.get("/get-all-users", getAllUsers);
staffRoute.post("/allocate-bed", allocateBed);

export default staffRoute; 