import { Router } from "express"
import { register, sendOTP, verifyOTP } from "../controllers/auth.controller"



const router = Router()

router.post("/register", register)
router.post("/sendOTP",sendOTP)
router.post("/verifyOTP",verifyOTP)

export default router