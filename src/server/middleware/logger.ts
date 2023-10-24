import { logRequest, logResponse } from '@/log';
import express from 'express';
export function logger(app: express.Express) {
  app.use((req, res, next) => {
    const end = res.end;
    const path = req.path;
    const method = req.method;
    const msStart = new Date().getTime();
    logRequest(method, path, req.ip, req.get('user-agent') || '');
    res.end = function (...d: any) {
      logResponse(method, path, res.statusCode, new Date().getTime() - msStart);
      res.end = end;
      return res.end(...d);
    };
    next();
  });
}
