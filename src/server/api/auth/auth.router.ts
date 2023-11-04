import { Router } from 'express';
import controller from './auth.controller';
import { isAuth } from '@server/middleware/isAuth';
const router = Router();

router.post('/login', controller.login);

router.post('/register', controller.register);

router.patch('/change-password', isAuth, controller.changePassword);

router.get('/refresh', controller.refresh);

router.get('/google', controller.google);
router.get('/google/redirect', controller.googleRedirect);

router.get('/verify-email', isAuth, controller.sendVerifyEmail);

router.get('/verify-email/:otp', isAuth, controller.verifyEmail);

router.post('/forgot-password', controller.forgotPassword);

router.post('/verify-password-otp', controller.verifyPasswordOTP);
router.post('/reset-password', controller.resetPassword);

export default router;
