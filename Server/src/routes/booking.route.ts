import { Router } from 'express';
import { verifyJWT } from "../middleware/auth.middleware";
import  * as bookingController from '../controller/booking.controller'

const router: Router = Router();
bookingController.finalizeCheckIn

router.route('/finalizeCheckIn').post(bookingController.finalizeCheckIn)

export default router;