import { Router } from 'express';
import controller from './auth.controller';
const router = Router();

// local auth
router.post('/login', controller.login);

export default router;
