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

router.post('/create-manager', managerController.create);

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

router.post('/product/:id/discount', isAuth, productController.addDiscount);
router.delete('/product/:id/discount', isAuth, productController.removeDiscount);

const categoryRouter = Router();
categoryRouter.post('/create', isAuth, UplaodCategoryPic(), categoryController.create);
// categoryRouter.post('/:id/add-sub', isAuth, categoryController.createSub);
categoryRouter.put('/:id/edit', isAuth, categoryController.editCategory);
categoryRouter.delete('/:id/remove', isAuth, categoryController.remove);
categoryRouter.post('/:id/add-products', isAuth, categoryController.addProducts);
categoryRouter.delete('/:id/remove-products', isAuth, categoryController.removeProducts);
router.use('/category', categoryRouter);

const brandRouter = Router();
brandRouter.post('/create', isAuth, brandController.create);
brandRouter.put('/:id/edit', isAuth, brandController.editBrand);
brandRouter.delete('/:id/remove', isAuth, brandController.remove);
brandRouter.post('/:id/add-products', isAuth, brandController.addProducts);
brandRouter.delete('/:id/remove-products', isAuth, brandController.removeProducts);
router.use('/brand', brandRouter);

export default router;
