import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { RoomModel } from "../models/Room";
import { BookingModel } from "../models/Booking";
import { PackageModel } from "../models/Package";
import { PackageBookingModel } from "../models/PackageBook";

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


        if(room.count <= 0){
            return res.status(400).json({ isBooked: false, message: "All room book" });
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
        try {
    console.log({ user: req.user.sub });

    const booking = await BookingModel.find({
        user: req.user.sub   
    });

    if (booking.length === 0) {
        return res.status(404).json({
        message: "No bookings found"
        });
    }

    res.status(200).json({
        message: "Get my booking",
        data: booking
    });

    } catch (err) {
        res.status(500).json({
            message: "Can't get my booking"
        });
    }

}

export const bookPackage = async (req: AuthRequest, res: Response) =>{
    console.log("Method run")
    const {packageId, date} = req.body
    if(!packageId){
        res.status(400).json({isBooked: false, message: "Require packageId"})
    }
    if(!date){
        res.status(400).json({isBooked: false, message: "Require Date"})
    }
    try {
        const packages = await PackageModel.findOne({ _id: packageId });

        if(!packages){
            return res.status(400).json({ isBooked: false, message: "Wrong packageId" });
        }

        // ✅ update field
        if(packages.count <= 0){
            return res.status(400).json({ isBooked: false, message: "All Package book" });
        }
        packages.count = packages.count-1;
        // save to DB
        await packages.save();

        
        // date => "2026-01-10" (frontend එකෙන් එන format)
        const checkIn = new Date(date);

        // ✅ set check-in time to 06:00 AM
        checkIn.setHours(6, 0, 0, 0);

        // ✅ check-out = check-in + 30 hours
        const checkOut = new Date(checkIn);
        checkOut.setHours(checkOut.getHours() + 24);

        console.log("CHECK IN :", checkIn);
        console.log("CHECK OUT:", checkOut);

        const newBook = new PackageBookingModel({
            user: req.user.sub,
            package: packageId,
            checkIn,
            checkOut
        })

        await newBook.save()

        res.status(200).json({
            isBooked: true,
            message: "package booked successfully",
            data: newBook
        });
    } catch (error) {
        
    }
}

export const getMyPackageBooking = async (req: AuthRequest, res: Response) =>{
        try {
    console.log({ user: req.user.sub });

    const booking = await PackageBookingModel.find({
        user: req.user.sub   
    });

    if (booking.length === 0) {
        return res.status(404).json({
        message: "No bookings found"
        });
    }

    res.status(200).json({
        message: "Get my booking",
        data: booking
    });

    } catch (err) {
        res.status(500).json({
            message: "Can't get my booking"
        });
    }

}