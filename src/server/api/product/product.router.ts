import {Router} from 'express';
import controller from './product.controller';

const router = Router();

// TODO: -> search prams
router.get('/list', controller.getList);
router.get('/:id', controller.getOne);

export default router;
