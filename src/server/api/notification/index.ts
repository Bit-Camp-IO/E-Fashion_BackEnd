import { InitRouterFunc } from '@type/server';
import router from './notification.router';

const initNotification: InitRouterFunc = app => {
  app.use('/notif', router);
};

export default initNotification;
