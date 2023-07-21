import { Router } from 'express';
import controller from './user.controller';
import cartController from './cart.controller';
import { isAuth } from '@server/middleware/isAuth';
import { UplaodProfilePic } from '@server/middleware/upload';
import userController from './user.controller';

const router = Router();

router.get('/me', isAuth, controller.getMe);
router.post('/profile-image', isAuth, UplaodProfilePic(), controller.updateProfile);

router.post('/favorites', isAuth, controller.addToFav);
router.delete('/favorites', isAuth, controller.removeFav);
router.get('/favorites', isAuth, controller.getMyFav);

router.post('/cart', isAuth, cartController.addToCart);
router.delete('/cart', isAuth, cartController.removeItem);
router.get('/cart', isAuth, cartController.getMyCart);
router.patch('/cart', isAuth, cartController.editItemQ);

router.post('/address', isAuth, userController.addAddress)

export default router;
