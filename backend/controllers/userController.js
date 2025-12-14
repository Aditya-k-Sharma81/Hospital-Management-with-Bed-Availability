import validator from 'validator';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import doctorModel from '../models/doctorModel.js';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import appointmentModel from '../models/appointmentModal.js';
import bedReceiptModel from '../models/bedReceiptModel.js';

// API to register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate fields
        if (!name || !email || !password) {
            return res.json({ success: false, message: "Missing details" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Enter a valid email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters" });
        }

        // Check if email already exists ----------------------------
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "Email already registered" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashPassword
        });

        const user = await newUser.save();

        // Create token ------------------
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET
        );

        return res.json({ success: true, token });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// api for user login ---------------

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}


// API to get user profile data 
const getProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const userData = await userModel.findById(userId).select("-password");
        res.json({ success: true, userData });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

// api to update User profile -----------
const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, phone, address, dob, gender } = req.body;
        const imageFile = req.file;
        if (!name || !phone || !address || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" })
        }


        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender });

        if (imageFile) {
            // upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            const imageURL = imageUpload.secure_url;
            await userModel.findByIdAndUpdate(userId, { image: imageURL });
        }

        res.json({ success: true, message: "Profile Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}



const bookAppointment = async (req, res) => {
    try {
        const userId = req.userId;
        const { docId, slotDate, slotTime } = req.body;

        const docData = await doctorModel.findById(docId).select("-password");

        if (!docData.available) {
            return res.json({ success: false, message: "Doctor not available" });
        }

        let slots_booked = docData.slots_booked || {};

        // check slot availability
        if (!slots_booked[slotDate]) {
            slots_booked[slotDate] = [];
        }

        if (slots_booked[slotDate].includes(slotTime)) {
            return res.json({ success: false, message: "Slot not available" });
        }

        slots_booked[slotDate].push(slotTime);

        const userData = await userModel.findById(userId).select("-password");

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fee,
            slotTime,
            slotDate,
            date: Date.now()
        };

        const newAppointment = await appointmentModel.create(appointmentData);

        // update doctor's booked slots
        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        res.json({ success: true, message: "Appointment Booked", newAppointment });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// Api to get user appointments for frontend my-appointments page -------

const listAppointment = async (req, res) => {
    try {
        const userId = req.userId;
        const appointments = await appointmentModel.find({ userId });
        res.json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// API to cnacel appointment -

const cancelAppointment = async (req, res) => {
    try {
        const userId = req.userId;
        const { appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);

        // verify appointment user

        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized access' });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
        // Releasing doctor slot ----

        const { docId, slotDate, slotTime } = appointmentData;

        const doctorData = await doctorModel.findById(docId);

        let slots_booked = doctorData.slots_booked;

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);

        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        res.json({ success: true, message: "Appointment Cancelled" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get bed receipts
const getBedReceipts = async (req, res) => {
    try {
        const userId = req.userId;
        const receipts = await bedReceiptModel.find({ userId });
        res.json({ success: true, receipts });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to delete bed receipt
const deleteBedReceipt = async (req, res) => {
    try {
        const userId = req.userId;
        const { receiptId } = req.body;

        if (!receiptId) {
            return res.json({ success: false, message: "Receipt ID required" });
        }

        const receipt = await bedReceiptModel.findById(receiptId);

        if (!receipt) {
            return res.json({ success: false, message: "Receipt not found" });
        }

        // Verify ownership
        if (receipt.userId.toString() !== userId) {
            return res.json({ success: false, message: "Unauthorized action" });
        }

        await bedReceiptModel.findByIdAndDelete(receiptId);

        res.json({ success: true, message: "Receipt deleted successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, getBedReceipts, deleteBedReceipt };
