import { InitRouterFunc } from '@type/server';
import router from './order.router';

const initOrder: InitRouterFunc = app => {
  app.use('/order', router);
};

export default initOrder;
