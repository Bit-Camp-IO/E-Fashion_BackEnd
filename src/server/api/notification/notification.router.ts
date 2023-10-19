import { Router } from 'express';
import controler from './notification.controller';
import { isAuth } from '@server/middleware/isAuth';

const router = Router();

router.use(isAuth);

router.get('/list', controler.getAll);
router.post('/subscribe', controler.subscribe);
router.delete('/unsubscribe', controler.unsubscribe);

export default router;
