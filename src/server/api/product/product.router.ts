import { Router } from 'express';
import controller from './product.controller';
const router = Router();

router.route('/').get(controller.getAll);

export default router;
