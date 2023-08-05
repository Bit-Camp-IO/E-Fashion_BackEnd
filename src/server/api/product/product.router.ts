import {Router} from 'express';
import controller from './product.controller';

const router = Router();

// TODO: -> search prams
router.get('/list', controller.getList);
router.get('/:id', controller.getOne);
router.get('/list/info', controller.listInfo);

//review
router.post('/:id/rate', controller.addReview);
export default router;
