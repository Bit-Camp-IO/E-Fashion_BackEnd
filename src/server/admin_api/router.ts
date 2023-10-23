import { Router } from 'express';
import managerController from './controllers/manager';
import authController from './controllers/auth';
import adminController from './controllers/admin';
import { isAuth } from '@server/middleware/isAuth';
import productController from './controllers/product';
import categoryController from './controllers/category';
import collectionController from './controllers/collection';
import brandController from './controllers/brand';
import { UploadCategoryPic, UploadProductsPics } from '@server/middleware/upload';
import orderController from './controllers/order';
import notifController from './controllers/notification';
import chatController from './controllers/chat';

const router = Router();

router.post('/create-manager', managerController.create);
router.post('/auth/login', authController.login);

const adminRouters = Router();
adminRouters.use(isAuth);

adminRouters.post('/create-super', managerController.createSuper);

adminRouters.post('/create', adminController.createAdmin);

adminRouters.delete('/:id/remove', adminController.removeAdmin);

adminRouters.get('/list', adminController.getAllAdmins);

adminRouters.get('/user/list', adminController.getAllUsers);

adminRouters.get('/user/:id', adminController.getOneUser);

adminRouters.post('/user/:id/ban', adminController.banUser);
adminRouters.post('/user/:id/unban', adminController.unBanUser);

adminRouters.post('/product/create', UploadProductsPics(), productController.create);
adminRouters.put('/product/:id/edit', productController.editProduct);
adminRouters.delete('/product/:id/remove', productController.remove);

adminRouters.post('/product/:id/discount', productController.addDiscount);
adminRouters.delete('/product/:id/discount', productController.removeDiscount);

const chatRouter = Router();
chatRouter.post('/:id/accept', chatController.acceptChat);
chatRouter.get('/list', chatController.getChats);
chatRouter.post('/:id/close', chatController.closeChat);
adminRouters.use('/chat', chatRouter);

const categoryRouter = Router();
categoryRouter.post('/create', UploadCategoryPic(), categoryController.create);
categoryRouter.put('/:id/edit', categoryController.editCategory);
categoryRouter.delete('/:id/remove', categoryController.remove);
categoryRouter.post('/:id/add-products', categoryController.addProducts);
categoryRouter.delete('/:id/remove-products', categoryController.removeProducts);
adminRouters.use('/category', categoryRouter);

const brandRouter = Router();
brandRouter.post('/create', brandController.create);
brandRouter.put('/:id/edit', brandController.editBrand);
brandRouter.delete('/:id/remove', brandController.remove);
brandRouter.post('/:id/add-products', brandController.addProducts);
brandRouter.delete('/:id/remove-products', brandController.removeProducts);
adminRouters.use('/brand', brandRouter);

const collectionRouter = Router();
collectionRouter.post('/create', collectionController.create);
collectionRouter.put('/:id/edit', collectionController.edit);
collectionRouter.delete('/:id/remove', collectionController.delete);
adminRouters.use('/collection', collectionRouter);

adminRouters.patch('/order/:id/status', orderController.changeOrderStatus);

adminRouters.post('/notif/push', notifController.push);

router.use(adminRouters);
export default router;
