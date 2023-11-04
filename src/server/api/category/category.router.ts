import { Router } from 'express';
import controller from './category.controller';

const router = Router();

router.get('/list', controller.getList);

router.get('/:id', controller.getOne);

export default router;
