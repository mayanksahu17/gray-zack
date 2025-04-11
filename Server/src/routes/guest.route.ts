import { Router } from 'express';
import { verifyJWT } from "../middleware/auth.middleware";
import * as  guestController  from '../controller/guest.controller';

const router: Router = Router();


router.post('/', guestController.createGuest);
router.get('/:id', guestController.getGuestById);
router.get('/hotel/:hotelId', guestController.getGuestsByHotel);
router.put('/:id', guestController.updateGuest);
router.delete('/:id', guestController.deleteGuest);
router.get('/search', guestController.searchGuests);


export default router;