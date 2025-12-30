import { Router } from "express"
import { logIn, register, sendOTP, verifyOTP } from "../controllers/auth.controller"



const router = Router()

router.post("/register", register)
router.post("/sendOTP",sendOTP)
router.post("/verifyOTP",verifyOTP)
router.post("/logIn", logIn)

export default router