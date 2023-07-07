import { Router } from 'express';
import managerController from './controllers/manager';
import authController from './controllers/auth';
import adminController from './controllers/admin';
import { isAuth } from '@server/middleware/isAuth';

const router = Router();

router.post('/manager/create', managerController.create);

router.post('/auth/login', authController.login);

router.post('/create', isAuth, adminController.createAdmin);

export default router;
