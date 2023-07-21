import RequestError from '@server/utils/errors';
import { HttpStatus } from '@server/utils/status';
import busboy from 'busboy';
import { RequestHandler } from 'express';
import { createWriteStream } from 'fs';
import path from 'path';

const uploadDir = 'uploads';

export function UplaodProfilePic(): RequestHandler {
  return (req, _, next) => {
    try {
      const bb = busboy({ headers: req.headers, limits: { files: 300000 } });
      bb.on('error', err => {
        throw err;
      });
      let fileName = '';
      bb.on('file', (name, file, info) => {
        if (name !== 'profile') {
          throw new RequestError('profile image required');
        }
        fileName = req.userId + Date.now().toString() + info.filename;
        const stream = createWriteStream(
          path.join(__dirname, '..', '..', '..', uploadDir, fileName),
        );
        file.pipe(stream);
      });

      bb.on('close', () => {
        req.file = '/' + fileName;
        next();
      });

      req.pipe(bb);
    } catch (err) {
      if (err.message === 'Missing Content-Type') {
        throw new RequestError(err.message, HttpStatus.BadRequest);
      }
      throw err;
    }
  };
}

declare global {
  namespace Express {
    export interface Request {
      file?: string;
    }
  }
}
