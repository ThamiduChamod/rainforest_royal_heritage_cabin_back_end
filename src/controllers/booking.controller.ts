import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { RoomModel } from "../models/Room";
import { BookingModel } from "../models/Booking";

export const bookRoom = async (req: AuthRequest, res: Response) =>{
    console.log("Method run")
    const {roomId, date} = req.body
    if(!roomId){
        res.status(400).json({isBooked: false, message: "Require RoomId"})
    }
    if(!date){
        res.status(400).json({isBooked: false, message: "Require Date"})
    }
    try {
        const room = await RoomModel.findOne({ _id: roomId });

        if(!room){
            return res.status(400).json({ isBooked: false, message: "Wrong RoomId" });
        }

        // ✅ update field
        room.count = room.count-1;
        // save to DB
        await room.save();

        
        // date => "2026-01-10" (frontend එකෙන් එන format)
        const checkIn = new Date(date);

        // ✅ set check-in time to 06:00 AM
        checkIn.setHours(6, 0, 0, 0);

        // ✅ check-out = check-in + 30 hours
        const checkOut = new Date(checkIn);
        checkOut.setHours(checkOut.getHours() + 30);

        console.log("CHECK IN :", checkIn);
        console.log("CHECK OUT:", checkOut);

        const newBook = new BookingModel({
            user: req.user.sub,
            room: roomId,
            checkIn,
            checkOut
        })

        await newBook.save()

        res.status(200).json({
            isBooked: true,
            message: "Room booked successfully",
            data: room
        });
    } catch (error) {
        
    }
}

export const getMyBooking = async (req: AuthRequest, res: Response) =>{
    
}