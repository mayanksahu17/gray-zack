import { Router } from 'express';
import {
  loginStaff,
  getStaffByHotel,
  updateStaff,
  deleteStaff,
  refreshToken,
  logoutStaff
} from '../controller/staff.controller';
import { verifyJWT } from '../middleware/auth.middleware';
import { authorizeStaff } from '../middleware/authorize.middleware';

const router = Router();

// Public routes
router.post("/login", loginStaff);
router.post("/refresh-token", refreshToken);

// Protected routes
router.use(verifyJWT); // Apply JWT verification to all routes below

router.get("/hotel/:hotelId", authorizeStaff(['HOTEL_OWNER', 'ADMIN']), getStaffByHotel);
router.put("/:id", authorizeStaff(['HOTEL_OWNER', 'ADMIN']), updateStaff);
router.delete("/:id", authorizeStaff(['HOTEL_OWNER', 'ADMIN']), deleteStaff);
router.post("/logout", logoutStaff);

export default router;
