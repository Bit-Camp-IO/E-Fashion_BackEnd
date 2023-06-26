import { Router, Express } from 'express';

export default (app: Express) => {
  const router = Router();
  router.get('/version', (_, res) => {
    res.json({
      version: require('../../package.json').version,
    });
  });
  // TODO: set up routers
  app.use('/api', router);
};
