import { logRequest, logResponse } from '@/log';
import express from 'express';
export function logger(app: express.Express) {
  app.use((req, res, next) => {
    logRequest(req.method, req.path, req.ip, req.get('user-agent') || '');
    res.end = customEnd(req, res);
    next();
  });
}

type End = (
  cb?: () => void,
) =>
  | any
  | ((chunk: any, cb?: () => void) => any)
  | ((chunk: any, encoding: BufferEncoding, cb?: () => void) => any);

function customEnd(req: express.Request, res: express.Response): End {
  const end = res.end;
  const path = req.path;
  const method = req.method;
  const msStart = new Date().getTime();
  return (...d) => {
    logResponse(method, path, res.statusCode, new Date().getTime() - msStart);
    res.end = end;
    res.end(...d);
  };
}
