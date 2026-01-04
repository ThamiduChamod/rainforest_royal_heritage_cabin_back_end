import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/role";
import { Role } from "../models/User";
import { bookPackage, bookRoom, getMyBooking, getMyPackageBooking } from "../controllers/booking.controller";

const route = Router()

route.post(
    "/roomBook",
    authenticate,
    requireRole([Role.ADMIN, Role.AUTHOR, Role.USER]),
    bookRoom
)

route.get(
    "/getBookings",
    authenticate,
    requireRole([Role.ADMIN, Role.AUTHOR, Role.USER]),
    getMyBooking
)

route.post(
    "/packageBook",
    authenticate,
    requireRole([Role.ADMIN, Role.AUTHOR, Role.USER]),
    bookPackage
)

route.get(
    "/getPackageBookings",
    authenticate,
    requireRole([Role.ADMIN, Role.AUTHOR, Role.USER]),
    getMyPackageBooking
)
export default route