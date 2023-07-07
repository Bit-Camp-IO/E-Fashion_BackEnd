// import { Router } from 'express';
import { InitRouterFunc } from '@type/server';
import adminRouter from './router';

const initAdminApi: InitRouterFunc = app => {
  // TODO: set up routers

  app.use('/admin', adminRouter);
};

export default initAdminApi;
