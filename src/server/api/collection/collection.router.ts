import { Router } from 'express';
import controller from './collection.controller';

const router = Router();

router.get('/:id', controller.findOne);
router.get('/', controller.findAll);

export default router;
