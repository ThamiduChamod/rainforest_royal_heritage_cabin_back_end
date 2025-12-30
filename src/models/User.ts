import mongoose, { Document, Schema } from "mongoose";

export enum Role{
    ADMIN = "ADMIN",
    AUTHOR = "AUTHOR",
    USER = "USER"
}

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId
    firstName:string
    lastName: string
    email: string
    password: string
    roles :Role[]
}

const userSchema = new Schema<IUser>({
    firstName: { type: String, required: true },
    lastName: {type: String, required: true},
    email: { type: String, unique: true, lowercase: true},
    password: { type: String, required: true},
    roles: { type: [String], enum: Object.values(Role), default: [Role.USER]}
})

export const User = mongoose.model<IUser>("User", userSchema)