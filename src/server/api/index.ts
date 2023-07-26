import { Router } from 'express';
import { InitRouterFunc } from '@type/server';
import initAuth from './auth';
import initProduct from './product';
import { HttpStatus } from '@server/utils/status';
import initCategory from './category';
import initBrand from './brand';
import initUser from './user';
import initOrder from './order';

const initApi: InitRouterFunc = app => {
  const router = Router();
  router.get('/version', (_, res) => res.JSON(HttpStatus.Ok, { version: '0,0,1' }));
  // TODO: set up routers
  initAuth(router);
  initUser(router);
  initProduct(router);
  initCategory(router);
  initBrand(router);
  initOrder(router);
  app.use('/api', router);
};

export default initApi;
