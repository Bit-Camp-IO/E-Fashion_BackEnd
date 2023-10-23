import { Router } from 'express';
import controller from './notification.controller';
import { isAuth } from '@server/middleware/isAuth';

const router = Router();

router.use(isAuth);

router.get('/list', controller.getAll);
router.post('/subscribe', controller.subscribe);
router.delete('/unsubscribe', controller.unsubscribe);

export default router;
