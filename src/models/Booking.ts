import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  user: mongoose.Types.ObjectId;  // Who booked
  room: mongoose.Types.ObjectId;  // Which room
  checkIn: Date;
  checkOut: Date;                     // Booking date
  createdAt: Date;                // Auto timestamp
}

const BookingSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    room: { type: Schema.Types.ObjectId, ref: "Room", required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true }
  },
  { timestamps: true } // automatically adds createdAt and updatedAt
);

export const BookingModel = mongoose.model<IBooking>("Booking", BookingSchema);
