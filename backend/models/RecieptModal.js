import mongoose from "mongoose";

const receiptSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    docId: {
      type: String,  
      required: true,
    },

    userData: {
      type: Object,
      required: true,
    },

    docData: {
      type: Object,
      required: true,
    },

    disease: {
      type: String,
      required: true,
      trim: true,
    },

    prescription: {
      type: String,
      required: true,
    },

    bedNeeded: {
      type: String,
      enum: ["yes", "no"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Receipt", receiptSchema);
