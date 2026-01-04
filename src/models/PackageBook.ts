import mongoose, { Schema, Document } from "mongoose";

export interface PBooking extends Document {
  user: mongoose.Types.ObjectId;  // Who booked
  package: mongoose.Types.ObjectId;  // Which room
  checkIn: Date;
  checkOut: Date;                     // Booking date
  createdAt: Date;                // Auto timestamp
}

const PackageBookingSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    package: { type: Schema.Types.ObjectId, ref: "Package", required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true }
  },
  { timestamps: true } // automatically adds createdAt and updatedAt
);

export const PackageBookingModel = mongoose.model<PBooking>("PackageBooking", PackageBookingSchema);
