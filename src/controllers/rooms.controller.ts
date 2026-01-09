import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import cloudinary from "../config/cloudinary";
import { RoomModel } from "../models/Room";

export const saveRoom = async (req: AuthRequest, res: Response) =>{
    
    try {
        
        if(!req.user) {
            return res.status(401).json({isSave: false,message:"Unauthorized"})
        }
        
        console.log("method run")
        const{type, price, status, pax, bedType, amenities, count} = req.body
        let imageURL = ''

        if(req.file){
            const result: any = await new Promise((resole, reject) =>{
                const upload_stream = cloudinary.uploader.upload_stream(
                    {folder: "imageRoom"},
                    (error, result) => {
                        if(error){
                            console.error("image Not save",error)
                            return reject(error)
                        }
                        resole(result)
                    }
                )
                upload_stream.end(req.file?.buffer)
            })
            imageURL = result.secure_url
            console.log(imageURL)
        }

        if(imageURL === ''){
            return res.status(401).json({isSave: false, message:"image save fail"})
        }

        const newRoom = new RoomModel({
            type,
            price,
            status,
            pax,
            bedType,
            amenities,
            image:imageURL,
            count
        })
        try {
            await newRoom.save()
            
            console.log("image save")
            res.status(201).json({
                isSave: true,
                message: "Save Room",
                data: newRoom
            })
        } catch (error) {
            res.status(500).json({isSave: false, message:`${error}`})
        }
    } catch (error) {
        res.status(500).json({isSave: false,message:`${error}`})
    }
}

export const getAllRooms = async (req:Request, res:Response) => {
    try {
        const room =await RoomModel.find()

        res.status(201).json({
            message:"post data",
            data: room
        })
    } catch (error) {
        
    }
}

export const deleteRoom = async (req:AuthRequest, res: Response) =>{
    console.log("method run")
    try {
         const { id } = req.body
         console.log(id)
        await RoomModel.deleteOne({_id:id})
        res.status(200).json({isDelete: true, message:"delete successfully"})
    } catch (error) {
        res.status(500).json({isDelete: true,message:"can't delete"})
    }
} 

export const updateRoom = async (req:AuthRequest,  res: Response) =>{
    
    try {
        
        const { id, type, price, pax, bedType,  count } = req.body;

        // 2.findById(id) ලෙස කෙලින්ම ID එක දිය යුතුයි (Object එකක් ලෙස නොවේ)
        const exitRoom = await RoomModel.findById(id);

        if (!exitRoom) {
            return res.status(404).json({
                isUpdate: false,
                message: "Room not found"
            });
        }

        
        if (req.file) {
            const result: any = await new Promise((resolve, reject) => {
                const upload_stream = cloudinary.uploader.upload_stream(
                    { folder: "imageRoom" },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );
                upload_stream.end(req.file?.buffer);
            });
            exitRoom.image = result.secure_url;
        }

        exitRoom.type = type || exitRoom.type;
        exitRoom.price = price || exitRoom.price;
        exitRoom.pax = pax || exitRoom.pax;
        exitRoom.bedType = bedType || exitRoom.bedType;
        exitRoom.count = count || exitRoom.count;

        // Amenities Array එකක් ලෙස එන්නේ නම් පමණක් Update කරන්න
        // සමහර විට Frontend එකෙන් JSON string එකක් ලෙස එවන්නේ නම් JSON.parse(amenities) අවශ්‍ය වේ
        
        
        await exitRoom.save();

        return res.status(200).json({
            isUpdate: true,
            message: "Room updated successfully"
        });

    } catch (error) {
        console.error("Update Error:", error);
        return res.status(500).json({
            isUpdate: false,
            message: "Room update fail"
        });
    }
}

