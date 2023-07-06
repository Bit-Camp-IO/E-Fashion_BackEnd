import { InitRouterFunc } from '@type/server';
import router from './product.router';

const initProduct: InitRouterFunc = app => {
  // TODO: Handle auth
  app.use('/product', router);
};

export default initProduct;
