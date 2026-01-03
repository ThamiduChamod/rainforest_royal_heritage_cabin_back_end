import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import cloudinary from "../config/cloudinary";
import { PackageModel } from "../models/Package";

export const savePackage = async (req: AuthRequest, res: Response) =>{
    try {
        if(req.user) {
            return res.status(401).json({message:"Unauthorized"})
        }

        const{name, price, tagline, status, features, count} = req.body
        let imageURL = ''

        if(req.file){
            const result: any = await new Promise((resole, reject) =>{
                const upload_stream = cloudinary.uploader.upload_stream(
                    {folder: "imagePackage"},
                    (error, result) => {
                        if(error){
                            console.error(error)
                            return reject(error)
                        }
                        resole(result)
                    }
                )
                upload_stream.end(req.file?.buffer)
            })
            imageURL = result.secure_url
        }

        const newPackage = new PackageModel({
            name,
            price,
            tagline,
            status,
            features,
            image:imageURL,
            count
        })
        try {
            await newPackage.save()
            res.status(201).json({
                 message: "Save Package",
                data: newPackage
            })
        } catch (error) {
            res.status(500).json({message:`${error}`})
        }
    } catch (error) {
        res.status(500).json({message:`${error}`})
    }
}