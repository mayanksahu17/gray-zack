import { Router } from 'express'
import { Request, Response } from 'express'
import { verifyJWT } from "../middleware/auth.middleware";
import { authorizePermission } from "../middleware/authorize.middleware";
import { AdminRole, AdminPermission } from '../models/administrator.model';
import { upload } from "../middleware/multer.middleware";
import {
  createHotel,
  updateHotelProfile,
  getHotelAnalytics,
  getHotelRevenue,
  createStaffRole,
  manageStaff,
  upgradePlan,
  getHotelDetails,
  getAllHotelStaff
} from '../controller/hotel.admin.controller';

const router: Router = Router();

// Hotel Profile Management
router.post(
  "/create",
  verifyJWT,
  authorizePermission([AdminRole.HOTEL_ADMIN], [AdminPermission.CREATE_HOTEL]),
  upload.array('hotelImages', 5),
  createHotel
);

router.put(
  "/:hotelId/profile",
  verifyJWT,
  authorizePermission([AdminRole.HOTEL_ADMIN]),
  upload.array('hotelImages', 5),
  updateHotelProfile
);

// Staff Management
router.post(
  "/:hotelId/roles",
  verifyJWT,
  authorizePermission([AdminRole.HOTEL_ADMIN]),
  createStaffRole
);

router.post(
  "/:hotelId/staff",
  verifyJWT,
  authorizePermission([AdminRole.HOTEL_ADMIN]),
  manageStaff
);

router.get(
  "/:hotelId/staff",
  verifyJWT,
  authorizePermission([AdminRole.HOTEL_ADMIN]),
  getAllHotelStaff
);

// Analytics and Revenue
router.get(
  "/:hotelId/analytics",
  verifyJWT,
  authorizePermission([AdminRole.HOTEL_ADMIN]),
  getHotelAnalytics
);

router.get(
  "/:hotelId/revenue",
  verifyJWT,
  authorizePermission([AdminRole.HOTEL_ADMIN]),
  getHotelRevenue
);

// Plan Management
router.post(
  "/:hotelId/upgrade-plan",
  verifyJWT,
  authorizePermission([AdminRole.HOTEL_ADMIN]),
  upgradePlan
);

router.get(
  "/:hotelId",
  verifyJWT,
  authorizePermission([AdminRole.HOTEL_ADMIN]),
  getHotelDetails
);

export default router