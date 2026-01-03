import mongoose, { Document, Schema } from "mongoose";

export enum STATUS {
    AVAILABLE = "AVAILABLE",
    BOOKED = "BOOKED"
}



export default interface Package extends Document{
    _id: mongoose.Types.ObjectId
    name: string
    price: string
    tagline: string
    status: STATUS
    features: string[]
    image: string
    count: number
}


const PackageSchema = new Schema<Package>(
  {
    name: {
      type: String,
      required: true,
    },

    price: {
      type: String,
      required: true,
      min: 0,
    },

    tagline: {
      type: String,
      required: true
    },

    status: {
        type: String,
        enum: Object.values(STATUS),
        default: STATUS.AVAILABLE,
    },
    

    features: {
      type: [String],
      default: [],
    },
    
    image: {
      type: String,
      required: true,
    },
    count: {
        type: Number,
        required: true
    },
  },
  {
    timestamps: true,
  }
);

/* ================= MODEL ================= */

export const PackageModel = mongoose.model<Package>("Package", PackageSchema);