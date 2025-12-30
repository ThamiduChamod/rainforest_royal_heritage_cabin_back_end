import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD

    }
})

export const sendOTPEmail = async (email: string, otp: string) =>{
    await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        html:`
            <h2>Your OTP: ${otp}</h2>
            <p>This OTP is valid for 2 minutes.</p>
        `
    })
}

