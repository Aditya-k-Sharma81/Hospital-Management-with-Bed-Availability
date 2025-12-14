import doctorModel from '../models/doctorModel.js';
import appointmentModel from "../models/appointmentModal.js";
import RecieptModal from '../models/RecieptModal.js';
import userModel from '../models/userModel.js';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();


const changeAvailability = async (req, res) => {
    try {
        const { docId } = req.body;

        // 1. Check if docId is provided
        if (!docId) {
            return res.json({ success: false, message: "docId is required" });
        }

        // 2. Find doctor
        const docData = await doctorModel.findById(docId);

        if (!docData) {
            return res.json({ success: false, message: "Doctor not found" });
        }

        // 3. Toggle availability
        await doctorModel.findByIdAndUpdate(
            docId,
            { available: !docData.available }
        );

        res.json({ success: true, message: 'Availability Changed' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const doctorList = async (req, res) => {
    try 
    {
        const doctors = await doctorModel.find({}).select(["-password", "-email"]);
        res.json({success: true,doctors});
    } catch (error){
        res.json({success: false,message: error.message});
    }
};


const doctorLogin = async(req,res) =>{
    try 
    {
        const {email, password} = req.body;
        const user = await doctorModel.findOne({email});

        if(!user)
        {
            return res.json({success:false, message:"User does not exist"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(isMatch)
        {
            const token = jwt.sign({id:user._id}, process.env.JWT_SECRET);
            res.json({success:true, token})
        }
        else
        {
            res.json({success:false, message: "Invalid credentials"})
        }
    }catch(error)
    {
        return res.status(500).json({ success: false, message: error.message });
    }
}


const doctorAppointmentList = async (req, res) => {
    try {
        
        const doctorId = req.userId;

        if (!doctorId) {
            return res.json({ success: false, message: "Doctor ID not found" });
        }
        const appointments = await appointmentModel.find({ docId: doctorId });

        res.json({ success: true, appointments });
    } 
    catch (error) {
        return res.json({ success: false, message: error.message });
    }
};





const Reciept = async (req, res) => {
  try {
    const { userId, docId, disease, prescription, bedNeeded, appointmentId } = req.body;

    // Validate input
    if (!userId || !docId || !disease || !prescription || !bedNeeded || !appointmentId) {
      return res.status(400).json({
        success: false,
        message: "All fields including appointmentId are required",
      });
    }

    // Fetch user
    const user = await userModel.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Fetch doctor
    const doctor = await doctorModel.findById(docId).select("-password");
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    // Convert Mongoose document into plain JS object
    const userData = JSON.parse(JSON.stringify(user));
    const docData = JSON.parse(JSON.stringify(doctor));

    // Create Receipt
    const newReceipt = await RecieptModal.create({
      userId,
      docId,
      userData,
      docData,
      disease,
      prescription,
      bedNeeded,
    });

    // ⭐ Mark Appointment as Completed
    const updatedAppt = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { isCompleted: true },
      { new: true } // returns updated document
    );

    if (!updatedAppt) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Receipt created & appointment marked as completed",
      receipt: newReceipt,
      updatedAppointment: updatedAppt,
    });

  } catch (error) {
    console.error("Receipt Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


export { changeAvailability, doctorList, doctorLogin,doctorAppointmentList, Reciept};
