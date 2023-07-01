import { Express } from 'express';
function cors(app: Express) {
  app.use((_, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    next();
  });
}

export default cors;
