import { Router } from 'express';
import { InitRouterFunc } from '@type/server';
import initAuth from './auth';

const initApi: InitRouterFunc = app => {
  const router = Router();
  router.get('/version', (_, res) => {
    res.json({
      version: '0,0,1',
    });
  });
  // TODO: set up routers
  initAuth(router);
  app.use('/api', router);
};

export default initApi;
