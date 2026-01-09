import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/role";
import { Role } from "../models/User";
import { deleteRoom, getAllRooms, saveRoom, updateRoom } from "../controllers/rooms.controller";
import {  getAllPackages, savePackage, updatePackage } from "../controllers/pacage.controller";
import { upload } from "../middleware/upload";

const route = Router()

route.post(
    "/createRoom",
    authenticate,
    requireRole([Role.ADMIN, Role.AUTHOR]),
    upload.single("image"),
    saveRoom
)
route.post(
    "/updateRoom",
    authenticate,
    requireRole([Role.ADMIN, Role.AUTHOR]),
    upload.single("image"),
    updateRoom
)
route.get(
    "/getAll",
    getAllRooms
)

route.post(
  "/roomDelete",
  authenticate,
  requireRole([Role.ADMIN, Role.AUTHOR]),
  deleteRoom
)


route.post(
    "/createPackage",
    authenticate,
    requireRole([Role.ADMIN, Role.AUTHOR]),
    upload.single("image"),
    savePackage
)

route.post(
    "/updatePackage",
    authenticate,
    requireRole([Role.ADMIN, Role.AUTHOR]),
    upload.single("image"),
    updatePackage
)

route.get(
    "/getAllPackage",
    getAllPackages
)

export default route