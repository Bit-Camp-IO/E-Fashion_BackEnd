import { Router } from 'express';
import controler from './order.controller';
import { isAuth } from '@server/middleware/isAuth';
// import { getStripeEvent } from '@/core/payment/stripe';
const router = Router();

// router.post('/', isAuth, controler.create);
router.post('/cash-order', isAuth, controler.createCashOrder);
router.get('/', isAuth, controler.getAll);
router.get('/:id', isAuth, controler.getOne);
router.get('/:id/items', isAuth, controler.getItems);
router.post('/create-payment-intent', isAuth, controler.paymentIntent);
export default router;
