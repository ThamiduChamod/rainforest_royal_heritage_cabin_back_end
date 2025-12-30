import { Request, Response } from "express"
import dotenv from 'dotenv'
import { Role, User } from "../models/User"
import bcrypt from "bcrypt"
import { OtpModel } from "../models/OTP"
import { generateOTP } from "../utils/otp"
import { sendOTPEmail } from "../utils/mailer"
dotenv.config()


export const sendOTP = async (req: Request, res: Response) =>{
    const {registerEmail} = req.body
    const email = registerEmail
    console.log(email)

    if (!email) {
        return res.status(400).json({message: "Email Required"})
    }

    await OtpModel.deleteMany({email})

    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000)

    try {
        await OtpModel.create({email, otp, expiresAt})
        await sendOTPEmail(email, otp)

        return res.status(201).json({status: 201, message:"OTP sended"})
    } catch (error: any) {
        return res.status(500).json({message: `OTP Send fail ${error}`})
    }
}

export const verifyOTP = async (req: Request,  res: Response) =>{
    const {email, otp} = req.body

    if (!email || !otp){
        return res.status(400).json({isValid: false, message:"Email & OTP Required"})
    }

    try {
      const record = await OtpModel.findOne({email:email, otp})

        if(!record){
            return res.status(400).json({isValid: false, message: "Invalid OTP"})
        }

        if (record.expiresAt < new Date()) {
            await OtpModel.deleteMany({ email:email });
            return res.status(400).json({isValid: false, message: "OTP expired" });
        }

        // OTP correct → delete it
        await OtpModel.deleteMany({ email:email });
        res.json({  isValid: true, message: "OTP verified successfully" });
  
    } catch (error) {
        return res.status(500).json({isValid: false, message:`sever error ${error}`})    
    }

}

export const register = async (req: Request, res: Response) =>{
    try{
        console.log("method is run")
        const{ firstName, lastName, registerEmail, registerPassword, role } = req.body
        console.log(req.body)
        console.log(firstName)

        if ( !firstName || !lastName || !registerEmail || !registerPassword || !role){
            return res.status(400).json({message:"All fields are required"})
        }

        if(role !== Role.USER){
            return res.status(400).json({message: "Invalid role"})
        }

        const existingUser = await User.findOne({registerEmail})
        if(existingUser){
            return res.status(400).json({message: "Email already register"})
        }

        const hashedPassword = await bcrypt.hash(registerPassword, 10)

        const newUser = new User({
            firstName,
            lastName,
            email: registerEmail,
            password: hashedPassword,
            roles: [role]
        })

        await newUser.save()

        res.status(201).json({
            message: role === Role.AUTHOR?
                "Author registered successfully":"User registered successfully",
            data:{
                id: newUser._id,
                email: newUser.email,
                roles: newUser.roles
            }
        })
    }catch(err: any){
        res.status(500).json({message: err?.message})
    }
}