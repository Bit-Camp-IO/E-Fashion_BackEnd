import Config from '@/config';
import RequestError from '@server/utils/errors';
import { HttpStatus } from '@server/utils/status';
import busboy from 'busboy';
import { RequestHandler } from 'express';
import { createWriteStream } from 'fs';
import path from 'path';

const mimeImage = ['image/jpeg', 'image/png'];

export function UplaodProfilePic(): RequestHandler {
  return (req, _, next) => {
    try {
      const bb = busboy({ headers: req.headers, limits: { files: 300000 } });
      bb.on('error', err => {
        next(err);
      });
      let fileName = '';
      bb.once('file', (name, file, info) => {
        validMimeType(bb, info.mimeType);
        if (name !== 'profile') {
          bb.emit('error', new RequestError('Accept only profile'));
        }
        fileName = req.userId + Date.now().toString() + info.filename;
        const stream = createWriteStream(path.join(Config.ProfileImagesDir, fileName));
        file.pipe(stream);
      });

      bb.on('close', () => {
        if (!fileName) {
          bb.emit('error', new RequestError('profile image required!', HttpStatus.BadRequest));
          return;
        }
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

export function UplaodProductsPics(): RequestHandler {
  return (req, _, next) => {
    const body: any = {
      imagesPath: [],
    };
    try {
      const bb = busboy({ headers: req.headers, limits: { fileSize: 300000 } });
      bb.on('error', err => {
        next(err);
      });
      bb.on('file', (name, file, info) => {
        validMimeType(bb, info.mimeType);
        if (name !== 'products') {
          bb.emit('error', new RequestError('Accept only products'));
        }
        const fileName = req.userId + Date.now().toString() + info.filename;
        file.on('end', () => {
          body.imagesPath.push(fileName);
        });
        file.on('error', err => next(err));
        const stream = createWriteStream(path.join(Config.ProductImagesDir, fileName));
        file.pipe(stream);
      });

      bb.on('field', (name, value) => {
        body[name] = value;
      });

      bb.on('close', () => {
        req.body = body;
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

export function UplaodCategoryPic(): RequestHandler {
  return (req, _, next) => {
    const body: any = {};
    try {
      const bb = busboy({ headers: req.headers, limits: { files: 300000 } });
      bb.on('error', err => {
        next(err);
      });
      bb.once('file', (name, file, info) => {
        validMimeType(bb, info.mimeType);
        if (name !== 'image') {
          bb.emit('error', new RequestError('Accept only image'));
        }
        const fileName = req.userId + Date.now().toString() + info.filename;
        file.on('end', () => {
          body.image = fileName;
        });
        file.on('error', err => next(err));
        const stream = createWriteStream(path.join(Config.CatImagesDir, fileName));
        file.pipe(stream);
      });

      bb.on('field', (name, value) => {
        body[name] = value;
      });

      bb.on('close', () => {
        req.body = body;
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

function validMimeType(bb: busboy.Busboy, mimeType: string) {
  if (!mimeImage.includes(mimeType)) {
    bb.emit('error', new RequestError('Invalid Mime type ' + mimeType, HttpStatus.BadRequest));
    return;
  }
}

declare global {
  namespace Express {
    export interface Request {
      file?: string;
    }
  }
}
