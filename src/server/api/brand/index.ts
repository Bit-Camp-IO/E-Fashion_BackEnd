import { InitRouterFunc } from '@type/server';
import router from './brand.router';

const initBrand: InitRouterFunc = app => {
  app.use('/brand', router);
};

export default initBrand;
