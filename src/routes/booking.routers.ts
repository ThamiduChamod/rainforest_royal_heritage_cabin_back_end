import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/role";
import { Role } from "../models/User";
import { bookRoom } from "../controllers/booking.controller";

const route = Router()

route.post(
    "/roomBook",
    authenticate,
    requireRole([Role.ADMIN, Role.AUTHOR, Role.USER]),
    bookRoom
)

export default route