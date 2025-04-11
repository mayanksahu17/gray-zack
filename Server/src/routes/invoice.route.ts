import { Router } from 'express';
import { verifyJWT } from "../middleware/auth.middleware";
import { createInvoice } from '../controller/invoice.controller';

const router: Router = Router();


router.post('/create', createInvoice);
export default router;