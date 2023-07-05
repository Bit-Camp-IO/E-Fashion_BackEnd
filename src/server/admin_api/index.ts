import { Router } from 'express';
import { InitRouterFunc } from '@type/server';
import initAuth from './auth';
import initManager from './manager';

const initAdminApi: InitRouterFunc = app => {
  const router = Router();
  // TODO: set up routers
  initAuth(router);
  initManager(router);
  app.use('/admin', router);
};

export default initAdminApi;
