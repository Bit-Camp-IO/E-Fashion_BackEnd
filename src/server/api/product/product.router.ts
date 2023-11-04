import { Router } from 'express';
import controller from './product.controller';
import { isAuth } from '@server/middleware/isAuth';

const router = Router();

router.get('/list', controller.getList);

router.get('/:id', controller.getOne);

router.get('/list/info', controller.listInfo);

router.get('/:id/rate', controller.listReviews);
router.post('/:id/rate', isAuth, controller.addReview);

router.get('/:id/rate/my-rating', isAuth, controller.myRate);
router.delete('/rate/:id', isAuth, controller.removeReview);

export default router;
