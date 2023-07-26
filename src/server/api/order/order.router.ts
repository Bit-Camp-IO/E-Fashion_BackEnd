import { Router } from 'express';
import controler from './order.controller';
const router = Router();

router.post('/', controler.create);
router.get('/', controler.getAll);
router.get('/:id', controler.getOne);
router.get('/:id/items', controler.getItems);

export default router;
