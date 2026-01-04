import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { ProfileModel } from "../models/profile";

export const saveProfile = async (req:AuthRequest, res: Response)=>{
    
    try {
        if(!req.user.sub){
            return res.status(400).json({message:"Unauthorized"})
        }

        const exitProfile = await ProfileModel.findById(req.user.sub)
        if(exitProfile){
            return res.status(400).json({message:"User already"})
        }

        const {address, phone, country} = req.body

        if(!address || !phone || !country){
            return res.status(400).json({message:"All are require"})
        }
        console.log("run")
        const profile = new ProfileModel({
            user:req.user.sub,
            address,
            phone,
            country
        })

        await profile.save

        res.status(200).json({isSave: true,message:"profile save"})
    } catch (error) {
        return res.status(500).json({isSave: false,message:"profile save fail"})
    }
}