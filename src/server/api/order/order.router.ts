import { Router } from 'express';
import controler from './order.controller';
import { isAuth } from '@server/middleware/isAuth';

const router = Router();

router.post('/cash-order', isAuth, controler.createCashOrder);

router.get('/', isAuth, controler.getAll);

router.get('/:id/items', isAuth, controler.getItems);

router.post('/create-payment-intent', isAuth, controler.paymentIntent);

export default router;
