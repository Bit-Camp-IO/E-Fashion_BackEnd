import {Router} from 'express';
import managerController from './controllers/manager';
import authController from './controllers/auth';
import adminController from './controllers/admin';
import {isAuth} from '@server/middleware/isAuth';
import productController from './controllers/product';

const router = Router();

router.post('/create-manager', managerController.create); // *

router.post('/create-super', isAuth, managerController.createSuper); // *

router.post('/auth/login', authController.login); // *

router.post('/create', isAuth, adminController.createAdmin); // *

router.delete('/remove', isAuth, adminController.removeAdmin); // *

router.get('/list', isAuth, adminController.getAllAdmins); // *

router.get('/user/list', isAuth, adminController.getAllUsers); // *

router.get('/user/:id', isAuth, adminController.getOneUser); // *

router.post('/user/:id/ban');
router.post('/user/:id/unban');

router.post('/product/create', isAuth, productController.create);
router.delete('/product/:id/remove', isAuth, productController.remove);
router.get('/product', isAuth, productController.getAllProductsForAdmin);

export default router;
