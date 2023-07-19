import { InitRouterFunc } from '@type/server';
import router from './user.router';

const initUser: InitRouterFunc = app => {
  app.use('/user', router);
};

export default initUser;
