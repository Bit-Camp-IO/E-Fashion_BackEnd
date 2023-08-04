import { NotFoundError } from '@/core/errors';
import { User } from '@/core/user';
import { validateId } from '@/core/utils';
import { Controller, Validate } from '@server/decorator';
import RequestError from '@server/utils/errors';
import { HttpStatus } from '@server/utils/status';
import { Request, Response } from 'express';
import { addressSchema } from './user.valid';

@Controller()
class UserController {
  async getMe(req: Request, res: Response) {
    const user = new User(req.userId!);
    const userResult = await user.me();
    if (userResult.error) {
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Ok, userResult.result);
  }

  async getMyFav(req: Request, res: Response) {
    const user = new User(req.userId!);
    const myFav = await user.myFav();
    if (myFav.error) {
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Ok, myFav.result);
  }

  async addToFav(req: Request, res: Response) {
    const id = req.body['id'];
    if (!validateId(id)) throw new RequestError(`id '${id}' is not valid`, HttpStatus.BadRequest);
    const user = new User(req.userId!);
    const favList = await user.addToFav(id);
    if (favList.error) {
      if (favList.error instanceof NotFoundError)
        throw new RequestError(favList.error.message, HttpStatus.BadRequest);
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Ok, favList.result);
  }

  async removeFav(req: Request, res: Response) {
    const id = req.body['id'];
    if (!validateId(id)) throw new RequestError(`id '${id}' is not valid`, HttpStatus.BadRequest);
    const user = new User(req.userId!);
    const error = await user.removeFav(id);
    if (error) throw RequestError._500();
    res.sendStatus(HttpStatus.NoContent);
  }

  async updateProfile(req: Request, res: Response) {
    const user = new User(req.userId!);
    const image = await user.updateProfileImage(req.file!);
    if (image.error) {
      if (image.error instanceof NotFoundError) {
        throw new RequestError(image.error.message, HttpStatus.BadRequest);
      }
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Accepted, image.result);
  }

  async getAddresses(req: Request, res: Response) {
    const user = new User(req.userId!);
    const addresses = await user.getAddresses();
    if (addresses.error) {
      if (addresses.error instanceof NotFoundError) {
        throw new RequestError(addresses.error.message, HttpStatus.BadRequest);
      }
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Ok, addresses.result);
  }

  @Validate(addressSchema)
  async addAddress(req: Request, res: Response) {
    const user = new User(req.userId!);
    const body = req.body;
    const userAddress = await user.addNewAddress(body);
    if (userAddress.error) {
      if (userAddress.error instanceof NotFoundError) {
        throw new RequestError(userAddress.error.message, HttpStatus.BadRequest);
      }
      throw new RequestError(userAddress.error.message, HttpStatus.BadRequest);
    }
    res.JSON(HttpStatus.Created, userAddress.result);
  }

  async removeAddress(req: Request, res: Response) {
    const id = req.params['id'];
    if (!validateId(id)) throw new RequestError(`id '${id}' is not valid`, HttpStatus.BadRequest);
    const user = new User(req.userId!);
    const error = await user.removeAddress(id);
    if (error) throw RequestError._500();
    res.sendStatus(HttpStatus.NoContent);
  }
}

export default new UserController();
