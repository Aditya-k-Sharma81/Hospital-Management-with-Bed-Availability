import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';
import staffRoute from './routes/staffRoute.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import bedModel from './models/bedModal.js';
import userModel from './models/userModel.js';

// app config
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Adjust for production
  }
});

const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Pass io to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// api endpoints
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);
app.use('/api/staff', staffRoute);
// localhost:4000/api/admin/add-doctor

app.get("/", (req, res) => {
  res.send("Hello world");
});

// Background Job for Auto-Discharge
setInterval(async () => {
  try {
    const expiredBeds = await bedModel.find({
      status: "occupied",
      dischargeDate: { $lt: new Date() }
    });

    if (expiredBeds.length > 0) {
      for (const bed of expiredBeds) {
        if (bed.userId) {
          await userModel.findByIdAndUpdate(bed.userId, { admissionStatus: "Discharged" });
        }
        bed.status = "available";
        bed.userId = null;
        bed.patientName = "";
        bed.allocationDate = null;
        bed.dischargeDate = null;
        await bed.save();
      }
      // Emit update to all clients
      io.emit("bedUpdate", { message: "Auto-discharged" });
      console.log(`Auto-discharged ${expiredBeds.length} beds.`);
    }
  } catch (error) {
    console.error("Auto-discharge error:", error);
  }
}, 2000); // Check every 2 seconds

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

httpServer.listen(port, () => {
  console.log("Server started on port:", port);
});
