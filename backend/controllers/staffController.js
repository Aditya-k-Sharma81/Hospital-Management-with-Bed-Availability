import jwt from 'jsonwebtoken';
import bedModel from '../models/bedModal.js';
import userModel from '../models/userModel.js';
import RecieptModal from '../models/RecieptModal.js';
import bedReceiptModel from '../models/bedReceiptModel.js';


const staffLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.STAFF_EMAIL && password === process.env.STAFF_PASSWORD) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET);
            return res.json({ success: true, token });
        }

        return res.json({ success: false, message: "Invalid credentials" });
    } catch (err) {
        console.log(err);
        return res.json({ success: false, message: err.message });
    }
};



const getAllBeds = async (req, res) => {
    try {
        // Auto-discharge logic: Find occupied beds where dischargeDate has passed
        const expiredBeds = await bedModel.find({
            status: "occupied",
            dischargeDate: { $lt: new Date() }
        });

        if (expiredBeds.length > 0) {
            for (const bed of expiredBeds) {
                // Update User Status
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
        }

        const beds = await bedModel.find({});
        res.json({ success: true, beds });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


// const getAllUsers = async (req, res) => {
//     try {
//         const receipts = await RecieptModal.find({});
//         const result = [];

//         for (const receipt of receipts) {
//             if (
//                 receipt.bedNeeded === "Yes" &&
//                 receipt.bedAllocated === "No"
//             ) {
//                 result.push(receipt);   // 👈 duplicate allowed
//             }
//         }

//         res.json({
//             success: true,
//             users: result
//         });

//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message });
//     }
// };



const getAllUsers = async (req, res) => {
    try {
        const receipts = await RecieptModal.find({});
        const result = [];

        for (const receipt of receipts) {
            if (
                receipt.bedNeeded === "Yes" &&
                receipt.bedAllocated === "No"
            ) {
                // Check if user already has an active bed receipt
                const activeBedReceipt = await bedReceiptModel.findOne({
                    userId: receipt.userId,
                    dischargeDate: { $gt: Date.now() }
                });

                if (activeBedReceipt) {
                    // Create a new Bed Receipt document with same dates (preserving allocation)
                    const newBedReceipt = new bedReceiptModel({
                        userId: activeBedReceipt.userId,
                        bedId: activeBedReceipt.bedId,
                        bedNumber: activeBedReceipt.bedNumber,
                        patientName: activeBedReceipt.patientName,
                        age: activeBedReceipt.age,
                        disease: receipt.disease,
                        doctorName: receipt.docData.name,
                        wardType: activeBedReceipt.wardType,
                        allocationDate: activeBedReceipt.allocationDate,
                        dischargeDate: activeBedReceipt.dischargeDate
                    });

                    await newBedReceipt.save();

                    // Mark current receipt request as allocated
                    receipt.bedAllocated = "Yes";
                    await receipt.save();

                } else {
                    // If no active bed, add to result for manual allocation
                    result.push(receipt);
                }
            }
        }

        res.json({
            success: true,
            users: result
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// const getAllUsers = async (req, res) => {
//     try {
//         // Fetch all receipts
//         const receipts = await RecieptModal.find({});

//         // Map to userData and deduplicate by _id
//         const uniqueUsersMap = new Map();

//         receipts.forEach((receipt) => {
//             if (receipt.userData && receipt.userData._id) {
//                 uniqueUsersMap.set(receipt.userData._id.toString(), receipt.userData);
//             }
//         });

//         const users = Array.from(uniqueUsersMap.values());

//         res.json({ success: true, users });
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message });
//     }
// }

const allocateBed = async (req, res) => {
    try {
        const { bedId, userId, dischargeDate } = req.body;
        console.log(userId);

        if (!bedId || !userId || !dischargeDate) {
            return res.json({ success: false, message: "Missing bedId, userId or dischargeDate" });
        }

        const bed = await bedModel.findById(bedId);
        if (!bed) {
            return res.json({ success: false, message: "Bed not found" });
        }

        if (bed.status === "occupied") {
            return res.json({ success: false, message: "Bed is already occupied" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        bed.status = "occupied";
        bed.userId = userId;
        bed.patientName = user.name;
        bed.allocationDate = Date.now();
        bed.dischargeDate = dischargeDate;
        await bed.save();

        // Retrieve user age if available, otherwise default (to be handled)
        let age = 0;
        if (user.dob && user.dob !== "Not Selected") {
            const birthDate = new Date(user.dob);
            if (!isNaN(birthDate.getTime())) {
                age = new Date().getFullYear() - birthDate.getFullYear();
            }
        }

        // Check for existing Appointment Receipt to get Medical Details and mark bed as allocated
        const latestReceipt = await RecieptModal.findOne({ userId }).sort({ createdAt: -1 });

        if (latestReceipt) {
            latestReceipt.bedAllocated = "Yes";
            await latestReceipt.save();
        }

        const disease = latestReceipt ? latestReceipt.disease : "Not Specified";
        let doctorName = "Not Assigned";
        if (latestReceipt && latestReceipt.docData && latestReceipt.docData.name) {
            doctorName = latestReceipt.docData.name;
        }

        // Create Bed Receipt
        const receiptEntry = new bedReceiptModel({
            userId,
            bedId,
            bedNumber: bed.bedNumber,
            patientName: user.name,
            age,
            disease,
            doctorName,
            allocationDate: Date.now(),
            dischargeDate: dischargeDate,
            wardType: bed.wardType
        });

        await receiptEntry.save();

        req.io.emit("bedUpdate", { message: "Bed Allocated" });

        res.json({ success: true, message: "Bed allocated successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const dischargePatient = async (req, res) => {
    try {
        const { bedId, receiptId } = req.body;

        if (!bedId || !receiptId) {
            return res.json({ success: false, message: "Missing Details" });
        }

        const bedReceipt = await bedReceiptModel.findById(receiptId);
        if (!bedReceipt) {
            return res.json({ success: false, message: "Receipt not found" });
        }

        // Update discharge date to now
        bedReceipt.dischargeDate = Date.now();
        await bedReceipt.save();

        const bed = await bedModel.findById(bedId);
        if (bed) {
            bed.status = "available";
            bed.userId = null;
            bed.patientName = "";
            bed.allocationDate = null;
            bed.dischargeDate = null;
            await bed.save();
        }

        // Update User Status
        if (bedReceipt.userId) {
            await userModel.findByIdAndUpdate(bedReceipt.userId, { admissionStatus: "Discharged" });
        }

        req.io.emit("bedUpdate", { message: "Patient Discharged" });

        res.json({ success: true, message: "Patient discharged successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}



const getAllBedReceipts = async (req, res) => {
    try {
        const receipts = await bedReceiptModel.find({}).sort({ allocationDate: -1 });
        res.json({ success: true, receipts });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { staffLogin, getAllBeds, getAllUsers, allocateBed, getAllBedReceipts, dischargePatient }