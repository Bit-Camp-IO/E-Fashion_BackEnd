import { InitRouterFunc } from '@type/server';
import router from './manager.router';

const initManager: InitRouterFunc = app => {
  app.use('/manager', router);
};

export default initManager;
