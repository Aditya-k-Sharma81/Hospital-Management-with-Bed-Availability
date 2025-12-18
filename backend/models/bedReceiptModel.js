import mongoose from "mongoose";

const bedReceiptSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        bedId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "beds",
            required: true,
        },
        bedNumber: {
            type: String,
            required: true,
        },
        patientName: {
            type: String,
            required: true,
        },
        age: {
            type: Number,
            default: 0
        },
        disease: {
            type: String,
            required: true,
        },
        doctorName: {
            type: String,
            default: "Not Assigned"
        },
        allocationDate: {
            type: Date,
            required: true,
        },
        dischargeDate: {
            type: Date,
            required: true,
        },
        wardType: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const bedReceiptModel =
    mongoose.models.bedReceipt || mongoose.model("bedReceipt", bedReceiptSchema);

export default bedReceiptModel;








// import mongoose from "mongoose";

// const bedReceiptSchema = new mongoose.Schema(
//     {
//         userId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "user",
//             required: true,
//         },
//         bedId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "beds",
//             required: true,
//         },
//         bedNumber: {
//             type: String,
//             required: true,
//         },
//         patientName: {
//             type: String,
//             required: true,
//         },
//         age: {
//             type: Number,
//             default: 0
//         },
//         disease: {
//             type: String,
//             required: true,
//         },
//         doctorName: {
//             type: String,
//             default: "Not Assigned"
//         },
//         allocationDate: {
//             type: Date,
//             required: true,
//         },
//         dischargeDate: {
//             type: Date,
//             required: true,
//         },
//         wardType: {
//             type: String,
//             required: true,
//         },
//     },
//     { timestamps: true }
// );

// const bedReceiptModel =
//     mongoose.models.bedReceipt || mongoose.model("bedReceipt", bedReceiptSchema);

// export default bedReceiptModel;
