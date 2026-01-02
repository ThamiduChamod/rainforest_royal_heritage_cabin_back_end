import { Request, Response } from "express"
import dotenv from 'dotenv'
import { Role, User } from "../models/User"
import bcrypt from "bcrypt"
import { OtpModel } from "../models/OTP"
import { generateOTP } from "../utils/otp"
import { sendOTPEmail } from "../utils/mailer"
import { signInAccessToken, signInRefreshToken } from "../utils/token"
import jwt from "jsonwebtoken"
dotenv.config()

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string

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
        // await OtpModel.deleteMany({ email:email });
        await OtpModel.findOneAndUpdate(
            {email,otp},
            {isValid: true}
        )
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

        // if(role === Role.ADMIN ||role === Role.AUTHOR){
        //     return res.status(400).json({message:"Invalid Role"})
        // }
        const isValidEmail = await OtpModel.findOne({email:registerEmail})
        if(!isValidEmail || !isValidEmail.isValid){
            return res.status(400).json({message:"Wrong Email"})
        }

        // OTP correct → delete it
        await OtpModel.deleteMany({ email:registerEmail });


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
            message: role === Role.USER?
                "User registered successfully":"Admin registered successfully",
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

export const logIn = async (req: Request, res: Response) =>{
    const {email, password} = req.body

    if(!email || !password){
        return res.status(400).json({logIn: false, message:""})
    }

    try{
        const existingUser = await User.findOne({email})
        if(!existingUser){
            return res.status(400).json({logIn: false, message:"All fields are required"})
        }

        const valid = await bcrypt.compare(password,existingUser.password)
        if(!valid){
            return res.status(400).json({logIn: false, message:"Invalid credentials"})
        }

        const accessToken = signInAccessToken(existingUser)
        const refreshToken = signInRefreshToken(existingUser)

        res.status(201).json({
            logIn: true,
            message: "LogIn success",
            data :{
                email: existingUser.email,
                roles: existingUser.roles,
                accessToken,
                refreshToken
            }
        })


    }catch(err: any){
        return res.status(500).json({logIn: false, message:"Sever error",error: err})
    }

}

export const handelRefreshToken = async (req: Request, res: Response) =>{
    try{
        const {token} = req.body

        if(!token){
            return res.status(400).json({message: "Token required"})
        }

        const payLoad = jwt.verify(token, JWT_REFRESH_SECRET)
        const user = await User.findById(payLoad.sub)

        if(!user){
            return res.status(403).json({message: "Invalid refresh token"})
        }
        const accessToken = signInAccessToken(user)
        res.status(201).json({accessToken})
    }catch(err){
        res.status(403).json({message: "Invalid or expire token"})
    }

}