import {Router} from 'express';
import managerController from './controllers/manager';
import authController from './controllers/auth';
import adminController from './controllers/admin';
import {isAuth} from '@server/middleware/isAuth';

const router = Router();

router.post('/create-manager', managerController.create);

router.post('/create-super', isAuth, managerController.createSuper);

router.post('/auth/login', authController.login);

router.post('/create', isAuth, adminController.createAdmin);

router.delete('/remove', isAuth, adminController.removeAdmin);

router.get('/list', isAuth, adminController.getAllAdmins);

router.get('/users', isAuth, adminController.getAllUsers);

router.get('/user/:id', isAuth, adminController.getOneUser);

export default router;
