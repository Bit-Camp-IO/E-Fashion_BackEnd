import { InitRouterFunc } from '@type/server';
import router from './chat.router';

const initChat: InitRouterFunc = app => {
  app.use('/chat', router);
};

export default initChat;
