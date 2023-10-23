import { Router } from 'express';
import controller from './user.controller';
import cartController from './cart.controller';
import { isAuth } from '@server/middleware/isAuth';
import { UploadProfilePic } from '@server/middleware/upload';

const router = Router();

router.get('/me', isAuth, controller.getMe);

router.patch('/me/edit', isAuth, controller.editMe);

router.post('/profile-image', isAuth, UploadProfilePic(), controller.updateProfile);

router.post('/favorites', isAuth, controller.addToFav);
router.delete('/favorites', isAuth, controller.removeFav);
router.get('/favorites', isAuth, controller.getMyFav);

router.post('/cart', isAuth, cartController.addToCart);
router.delete('/cart', isAuth, cartController.removeItem);
router.get('/cart', isAuth, cartController.getMyCart);
router.patch('/cart', isAuth, cartController.editItemQ);

router.get('/address', isAuth, controller.getAddress);
router.post('/address', isAuth, controller.addAddress);

router.delete('/address/:id', isAuth, controller.removeAddress);

export default router;
