import mongoose,{Document, Schema} from "mongoose"

export interface IProfile extends Document {
    
    user: mongoose.Types.ObjectId;
    image:string
    address: string
    phone: number
    country: string
}
const userSchema = new Schema<IProfile>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    image: { type: String },
    address: {type: String, required: true},
    phone: {type: Number, required: true},
    country: {type: String, required: true},
    
})
export const ProfileModel = mongoose.model<IProfile>("Profile", userSchema)