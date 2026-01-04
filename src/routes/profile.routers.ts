import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { Role } from "../models/User";
import { requireRole } from "../middleware/role";
import { upload } from "../middleware/upload";
import { saveProfile } from "../controllers/profile.controller";

const route = Router()

route.post(
    "/save",
    authenticate,
    requireRole([Role.ADMIN, Role.AUTHOR, Role.USER]),
    upload.single("image"),
    saveProfile
)

export default route
