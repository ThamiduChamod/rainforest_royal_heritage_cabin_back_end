import { Response, Request } from "express";
import { AuthRequest } from "../middleware/auth";
import cloudinary from "../config/cloudinary";
import { PackageModel } from "../models/Package";

export const savePackage = async (req: AuthRequest, res: Response) =>{
    console.log("method run")
    try {
        if(!req.user) {
            return res.status(401).json({ isSave: false, message:"Unauthorized"})
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
                isSave: true,
                message: "Save Package",
                data: newPackage
            })
        } catch (error) {
            res.status(500).json({isSave: false,message:`${error}`})
        }
    } catch (error) {
        res.status(500).json({isSave: false, message:`${error}`})
    }
}

export const getAllPackages = async( req: Request, res: Response) =>{
    try {
            const allPackages =await PackageModel.find()
    
            res.status(201).json({
                message:"package data",
                data: allPackages
            })
        } catch (error) {
            
        }
}

export const updatePackage = async (req:AuthRequest,  res: Response) =>{
    
    try {
        
        const{id, name, price, tagline, status, features, count} = req.body
        
        const exitPackage = await PackageModel.findById(id);

        if (!exitPackage) {
            return res.status(404).json({
                isUpdate: false,
                message: "Package not found"
            });
        }
       
        if (req.file) {
            const result: any = await new Promise((resolve, reject) => {
                const upload_stream = cloudinary.uploader.upload_stream(
                    { folder: "imagePackage" },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );
                upload_stream.end(req.file?.buffer);
            });
            exitPackage.image = result.secure_url;
        }
 
        
        exitPackage.name = name || exitPackage.name;
        exitPackage.price = price || exitPackage.price;
        exitPackage.tagline = tagline || exitPackage.tagline;
        exitPackage.features = features || exitPackage.features;
        exitPackage.count = count || exitPackage.count;

        
        await exitPackage.save();

        return res.status(200).json({
            isUpdate: true,
            message: "Package updated successfully"
        });

    } catch (error) {
        console.error("Update Error:", error);
        return res.status(500).json({
            isUpdate: false,
            message: "Package update fail"
        });
    }
}