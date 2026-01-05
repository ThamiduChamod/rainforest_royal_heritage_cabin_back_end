import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { ProfileModel } from "../models/profile";

export const saveProfile = async (req:AuthRequest, res: Response)=>{
    
    try {
        if(!req.user.sub){
            return res.status(400).json({message:"Unauthorized"})
        }
console.log("methord 1")
        const exitProfile = await ProfileModel.findOne({user:req.user.sub})
        if(exitProfile){
            return res.status(400).json({message:"User already"})
        }
console.log("methord 2")
        const {address, phone, country} = req.body

        if(!address || !phone || !country){
            return res.status(400).json({message:"All are require"})
        }
console.log("methord 3")        
        const profile = new ProfileModel({
            user:req.user.sub,
            image:'',
            address,
            phone,
            country
        })

        await profile.save()

        res.status(200).json({isSave: true,message:"profile save"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({isSave: false,message:"profile save fail"})
    }
}