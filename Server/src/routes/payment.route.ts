import { Router } from 'express';
import { verifyJWT } from "../middleware/auth.middleware";
import { makePayment } from '../controller/payment.controller';


const router: Router = Router();


router.post('/make-payment', makePayment);
export default router;