import { InitRouterFunc } from '@type/server';
import router from './category.router';

const initCategory: InitRouterFunc = app => {
  app.use('/category', router);
};

export default initCategory;
