import mongoose, { Document, Schema } from "mongoose";

export interface IProfile extends Document {
    user: mongoose.Types.ObjectId
    image:string
    address: string
    phone: string
    country: string
}
const profile: Schema = new Schema<IProfile>({
    
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    image: { type: String },
    address: {type: String, required: true},
    phone: {type: String, required: true},
    country: {type: String, required: true},
    
    }, {timestamps: true,}
)
export const ProfileModel = mongoose.model<IProfile>("Profile", profile)