import { Router } from 'express';
import controller from './brand.controller';

const router = Router();

router.get('/list', controller.getList);

export default router;
