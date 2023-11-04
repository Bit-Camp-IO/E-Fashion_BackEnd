import { AdminRole } from '@/core/admin';
import { Controller, Guard, Validate } from '@server/decorator';
import { Request, Response } from 'express';
import { Admin } from '@/core/admin/admin';
import RequestError, { handleResultError, unwrapResult } from '@server/utils/errors';
import { HttpStatus } from '@server/utils/status';
import { createCollectionSchema, editCollectionSchema } from '../valid';
import type * as T from '@/core/collection';
import { validateId } from '@/core/utils';

@Controller()
class CollectionController {
  @Validate(createCollectionSchema)
  @Guard(AdminRole.ADMIN)
  public async create(req: Request, res: Response) {
    const admin = req.admin as Admin;
    const body: T.CollectionInput = req.body;
    const collection = await admin.createCollection(body);
    // if (collection.error) {
    //   throw RequestError._500();
    // }
    unwrapResult(collection);
    res.JSON(HttpStatus.Created, collection.result);
  }

  @Validate(editCollectionSchema)
  @Guard(AdminRole.ADMIN)
  public async edit(req: Request, res: Response) {
    const admin = req.admin as Admin;
    const body: T.EditCollectionInput = req.body;
    if (!validateId(req.params['id'])) {
      throw new RequestError('Invalid Collection id', HttpStatus.BadRequest);
    }
    const collection = await admin.editCollection(req.params['id'], body);
    // if (collection.error) {
    //   if (collection.error instanceof NotFoundError)
    //     throw new RequestError(collection.error.message, HttpStatus.BadRequest);
    //   throw RequestError._500();
    // }
    unwrapResult(collection);
    res.JSON(HttpStatus.Ok, collection.result);
  }
  @Guard(AdminRole.ADMIN)
  public async delete(req: Request, res: Response) {
    const admin = req.admin as Admin;
    if (!validateId(req.params['id'])) {
      throw new RequestError('Invalid Collection id', HttpStatus.BadRequest);
    }
    const error = await admin.removeCollection(req.params['id']);
    // if (error) {
    //   if (error instanceof NotFoundError)
    //     throw new RequestError(error.message, HttpStatus.BadRequest);
    //   throw RequestError._500();
    // }
    if (error) {
      handleResultError(error);
    }
    res.JSON(HttpStatus.Ok);
  }
}

export default new CollectionController();
