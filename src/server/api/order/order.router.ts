import { Router } from 'express';
import controler from './order.controller';
import { isAuth } from '@server/middleware/isAuth';
const router = Router();

router.post('/', isAuth, controler.create);
router.get('/', isAuth, controler.getAll);
router.get('/:id', isAuth, controler.getOne);
router.get('/:id/items', isAuth, controler.getItems);

export default router;
