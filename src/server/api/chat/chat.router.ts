import { Router } from 'express';
import controller from './chat.controller';
import { isAuth } from '@server/middleware/isAuth';

const router = Router();

router.use(isAuth);

router.post('/new-chat', controller.newChat);
router.get('/', controller.getChat);

router.post('/:id/new-message', controller.sendMessage);
router.get('/:id/messages', controller.getMessages);

export default router;
