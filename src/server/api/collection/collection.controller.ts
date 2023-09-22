import { Request, Response } from 'express';
import { Controller } from '@server/decorator';
import RequestError from '@server/utils/errors';
import { HttpStatus } from '@server/utils/status';
import { validateId } from '@/core/utils';
import { NotFoundError } from '@/core/errors';
import Collection from '@/core/collection';

@Controller()
class CollectionController {
  async findOne(req: Request, res: Response) {
    const id = req.params['id'];
    if (!validateId(id)) {
      throw new RequestError('Invalid Collection Id', HttpStatus.BadRequest);
    }
    const collection = await Collection.getOne(id);
    if (collection.error) {
      if (collection.error instanceof NotFoundError)
        throw new RequestError(collection.error.message, HttpStatus.NotFound);
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Ok, collection.result);
  }

  async findAll(_: Request, res: Response) {
    const collections = await Collection.getAll();
    if (collections.error) {
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Ok, collections.result);
  }
}

export default new CollectionController();
