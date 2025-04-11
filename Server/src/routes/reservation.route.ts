import { Router } from 'express';
import { verifyJWT } from "../middleware/auth.middleware";
import * as reservationController from '../controller/reservation.controller';
const router: Router = Router();


router.post('/create', reservationController.createBooking)
.get('/:id', reservationController.getBookingsByGuest)
.patch('/:id',reservationController.updateBooking)
.delete('/:id',reservationController.deleteBooking)

router.post('/checkInGuest',reservationController.checkInGuest)

router.get('/getAvailableRooms',reservationController.getAvailableRooms)


export default router;


