import { Router } from 'express';
import controler from './notification.controller';
import { isAuth } from '@server/middleware/isAuth';

const router = Router();

router.get('/list', isAuth, controler.getAll);
router.post('/subscribe', isAuth, controler.subscribe);
router.delete('/unsubscribe', isAuth, controler.unsubscribe);

export default router;
