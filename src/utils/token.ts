import dotenv from "dotenv"
import { IUser } from "../models/User"
import jwt from "jsonwebtoken"

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET as string

export const signInAccessToken = (user: IUser): string =>{
    return jwt.sign(
        {
            sub: user._id.toString(),
            role: user.roles
        },
        JWT_SECRET,
        {
            expiresIn: "1d"
        }
    )
}

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string

export const signInRefreshToken = (user: IUser): string=>{
    return jwt.sign(
        {
            sub: user._id.toString()
        },
        JWT_REFRESH_SECRET,
        {
            expiresIn: "7d"
        }
    )
}