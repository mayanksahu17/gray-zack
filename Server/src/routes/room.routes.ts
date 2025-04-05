import { Router } from 'express';
import { verifyJWT } from "../middleware/auth.middleware";
import { 
  createRoom, 
  getRooms, 
  getRoomById,
  updateRoom, 
  deleteRoom,
  updateRoomStatus,
  markRoomAsCleaned,
  seedHotelRooms
} from '../controller/room.controller';

const router: Router = Router();

// Public routes (you might want to protect these with JWT in production)
router.route('/seed-room').post(seedHotelRooms)

// router.route('/')
//   .get(getRooms)
//   .post(verifyJWT, createRoom)

// router.route('/:id')
//   .get(getRoomById)
//   .patch(verifyJWT, updateRoom)
//   .delete(verifyJWT, deleteRoom);

// router.route('/:id/status')
//   .patch(verifyJWT, updateRoomStatus);

// router.route('/:id/clean')
//   .patch(verifyJWT, markRoomAsCleaned);


// public route

router.route('/')
  .get(getRooms)
  .post(createRoom)

router.route('/:id')
  .get(getRoomById)
  .patch(updateRoom)
  .delete(deleteRoom);

router.route('/:id/status')
  .patch(updateRoomStatus);

router.route('/:id/clean')
  .patch(markRoomAsCleaned);


export default router;