import { InitRouterFunc } from '@type/server';
import router from './collection.router';

const initCollection: InitRouterFunc = app => {
  app.use('/collection', router);
};

export default initCollection;
