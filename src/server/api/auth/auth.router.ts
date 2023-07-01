import { Router } from 'express';
import controller from './auth.controller';
const router = Router();

// local auth
router.post('/login', controller.login);
router.post('/register', controller.register);

//refresh access token
router.get('/refresh', controller.refresh);

// OAuth2 auth
// google-auth
router.get('/google', controller.google);
router.get('/google/redirect', controller.googleRedirect);

export default router;
