import {Router} from 'express';
import controller from './product.controller';
import { isAuth } from '@server/middleware/isAuth';

const router = Router();

// TODO: -> search prams
router.get('/list', controller.getList);
router.get('/:id', controller.getOne);
router.get('/list/info', controller.listInfo);

//review
router.post('/:id/rate', isAuth, controller.addReview);
export default router;
