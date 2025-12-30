import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import authRouter from "./routes/auth.routers"
dotenv.config()

const SEVER_PORT = process.env.SERVER_PORT
const MONGO_URI = process.env.MONGO_URI as string

const app = express()

app.use(express.json())
app.use(
    cors({
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST", "PUT", "DELETE"]
    })
)

app.use("/api/v1/auth",authRouter)

mongoose
    .connect(MONGO_URI)
    .then(()=>{
        console.log("DB connect")
    })
    .catch((err)=>{
        console.error(`DB Connection fail: ${err}`)
        process.exit(1)
    });

app.listen(SEVER_PORT, ()=>{
    console.log(`Server is running on${SEVER_PORT}`)
})
