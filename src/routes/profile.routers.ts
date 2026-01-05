import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { Role } from "../models/User";
import { requireRole } from "../middleware/role";
import { upload } from "../middleware/upload";
import { getMyProfile, saveProfile, updatePhoto } from "../controllers/profile.controller";

const route = Router()

route.post(
    "/save",
    authenticate,
    requireRole([Role.ADMIN, Role.AUTHOR, Role.USER]),
    upload.single("image"),
    saveProfile
)

route.post(
    "/imageUpdate",
    authenticate,
    requireRole([Role.ADMIN, Role.AUTHOR, Role.USER]),
    upload.single("image"),
    updatePhoto
)

route.get(
    "/getMy",
    authenticate,
    requireRole([Role.ADMIN, Role.AUTHOR, Role.USER]),
    getMyProfile
)

export default route
