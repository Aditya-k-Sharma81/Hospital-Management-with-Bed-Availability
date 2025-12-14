// import mongoose from "mongoose";

// const bedSchema = new mongoose.Schema(
//   {
//     bedId: { type: String, required: true },  
//     floor: { type: Number, required: true },                 
//     status: { type: String, default: "available" },          
//     metaData: { type: String, default: "" },                  
//     createdAt: { type: Number, default: Date.now }           
//   }
// );

// const bedModel = mongoose.models.beds || mongoose.model("beds", bedSchema);
// export default bedModel;


import mongoose from "mongoose";

const bedSchema = new mongoose.Schema(
  {
    bedNumber: {
      type: String,
      required: true,
      unique: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    patientName: {
      type: String,
      default: "",
    },
    allocationDate: {
      type: Date,
      default: null,
    },
    dischargeDate: {
      type: Date,
      default: null,
    },

    wardType: {
      type: String,
      enum: ["General", "ICU"],
      required: true
    },

    status: {
      type: String,
      enum: ["available", "occupied"],
      default: "available"
    }
  },
  {
    timestamps: true
  }
);

const bedModel =
  mongoose.models.beds || mongoose.model("beds", bedSchema);

export default bedModel;
