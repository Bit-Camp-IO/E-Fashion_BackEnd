import { InitRouterFunc } from '@type/server';
import router from './auth.router';

const initAuth: InitRouterFunc = app => {
  app.use('/auth', router);
};

export default initAuth;
