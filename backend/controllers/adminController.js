import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";

import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModal.js";
import userModel from "../models/userModel.js";
import bedModel from "../models/bedModal.js";

/* ================= ADD DOCTOR ================= */

const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fee,
      address
    } = req.body;

    const imageFile = req.file;

    if (
      !name || !email || !password || !speciality ||
      !degree || !experience || !about || !fee ||
      !address || !imageFile
    ) {
      return res.json({ success: false, message: "Missing Details" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Password too short" });
    }

    const existingDoctor = await doctorModel.findOne({ email });
    if (existingDoctor) {
      return res.json({ success: false, message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const imageUpload = await cloudinary.uploader.upload(
      imageFile.path,
      { folder: "prescripto_doctors" }
    );

    await doctorModel.create({
      name,
      email,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fee,
      address: JSON.parse(address),
      image: imageUpload.secure_url,
      date: Date.now()
    });

    res.json({ success: true, message: "Doctor Added Successfully" });

  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

/* ================= ADMIN LOGIN ================= */

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET);
      return res.json({ success: true, token });
    }

    res.json({ success: false, message: "Invalid credentials" });

  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

/* ================= GET ALL DOCTORS ================= */

const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find().select("-password");
    res.json({ success: true, doctors });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

/* ================= ADD BED (ADMIN) ================= */

const addBed = async (req, res) => {
  try {
    const { bedNumber, wardType } = req.body;

    if (!bedNumber || !wardType) {
      return res.json({
        success: false,
        message: "bedNumber and wardType are required"
      });
    }

    const existingBed = await bedModel.findOne({ bedNumber });
    if (existingBed) {
      return res.json({
        success: false,
        message: "This bed already exists"
      });
    }

    const bed = await bedModel.create({
      bedNumber,
      wardType,
      status: "available"
    });

    res.json({
      success: true,
      message: "Bed added successfully",
      bed
    });

  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

/* ================= ADMIN DASHBOARD ================= */

const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.countDocuments();
    const users = await userModel.countDocuments();
    const appointments = await appointmentModel.find();

    // Fetch all beds to calculate status
    const allBeds = await bedModel.find({});
    const beds = allBeds.length;
    const occupiedBeds = allBeds.filter(b => b.status === 'occupied').length;
    const availableBeds = allBeds.filter(b => b.status === 'available').length;

    const earnings = appointments.reduce((sum, a) => {
      return a.isCompleted || a.payment ? sum + a.amount : sum;
    }, 0);

    res.json({
      success: true,
      dashData: {
        doctors,
        patients: users,
        appointments: appointments.length,
        beds,
        occupiedBeds,
        availableBeds,
        earnings,
        latestAppointments: appointments.slice(-5).reverse()
      }
    });

  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

/* ================= EXPORTS ================= */

export {
  addDoctor,
  loginAdmin,
  allDoctors,
  addBed,
  adminDashboard
};
