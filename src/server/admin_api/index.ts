import { InitRouterFunc } from '@type/server';
import adminRouter from './router';

const initAdminApi: InitRouterFunc = app => {
  app.use('/admin', adminRouter);
};

export default initAdminApi;
