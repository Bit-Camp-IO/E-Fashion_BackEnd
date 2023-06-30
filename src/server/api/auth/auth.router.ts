import { Router } from 'express';
import controller from './auth.controller';
const router = Router();

router.post('/login', controller.login);
router.post('/register', controller.register);

router.get('/refresh', controller.refresh);

export default router;
