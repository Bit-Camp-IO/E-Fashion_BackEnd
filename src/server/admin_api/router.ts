import { Router } from 'express';
import managerController from './controllers/manager';
import authController from './controllers/auth';
import adminController from './controllers/admin';
import { isAuth } from '@server/middleware/isAuth';
import productController from './controllers/product';
import categoryController from './controllers/category';
import brandController from './controllers/brand';
import { UplaodCategoryPic, UplaodProductsPics } from '@server/middleware/upload';

const router = Router();

router.post('/create-manager', managerController.create); // *

router.post('/create-super', isAuth, managerController.createSuper); // *

router.post('/auth/login', authController.login); // *

router.post('/create', isAuth, adminController.createAdmin); // *

router.delete('/remove', isAuth, adminController.removeAdmin); // *

router.get('/list', isAuth, adminController.getAllAdmins); // *

router.get('/user/list', isAuth, adminController.getAllUsers); // *

router.get('/user/:id', isAuth, adminController.getOneUser); // *

router.post('/user/:id/ban', isAuth, adminController.banUser);
router.post('/user/:id/unban', isAuth, adminController.unBanUser);

router.post('/product/create', isAuth, UplaodProductsPics(), productController.create);
router.put('/product/:id/edit', isAuth, productController.editProduct);
router.delete('/product/:id/remove', isAuth, productController.remove);

router.post('/category/create', isAuth, UplaodCategoryPic(), categoryController.create);
router.post('/category/:id/add-sub', isAuth, categoryController.createSub);
router.put('/category/:id/edit', isAuth, categoryController.editCategory);
router.delete('/category/:id/remove', isAuth, categoryController.remove);

router.post('/brand/create', isAuth, brandController.create);
router.put('/brand/:id/edit', isAuth, brandController.editBrand);
router.delete('/brand/:id/remove', isAuth, brandController.remove);

export default router;
