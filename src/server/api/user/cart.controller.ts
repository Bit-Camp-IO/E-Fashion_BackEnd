import { User } from '@/core/user';
import { validateId } from '@/core/utils';
import { Controller, Validate } from '@server/decorator';
import RequestError from '@server/utils/errors';
import { HttpStatus } from '@server/utils/status';
import { Request, Response } from 'express';
import { editItemCartSchema, itemCartSchema } from './user.valid';
import { CartItemData } from '@/core/user/interfaces';

async function getUserCart(userId: string) {
  const user = new User(userId);
  const { result: cart, error } = await user.getMyCart();
  if (error) {
    throw RequestError._500();
  }
  return cart;
}

@Controller()
class UserController {
  @Validate(itemCartSchema)
  async addToCart(req: Request, res: Response) {
    const item: CartItemData = req.body;
    if (!validateId(item.id))
      throw new RequestError(`id '${item.id}' is not valid`, HttpStatus.BadRequest);
    const cart = await getUserCart(req.userId!);
    const cartResult = await cart.addItem(item);
    if (cartResult.error) {
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Created, cartResult.result);
  }

  async removeItem(req: Request, res: Response) {
    const id: string = req.body['id'];
    if (!validateId(id)) throw new RequestError(`id '${id}' is not valid`, HttpStatus.BadRequest);
    const cart = await getUserCart(req.userId!);
    cart.removeItem(id);
    res.sendStatus(HttpStatus.NoContent);
  }
  async getMyCart(req: Request, res: Response) {
    const cart = await getUserCart(req.userId!);
    const result = await cart.getCart();
    res.JSON(HttpStatus.Ok, result);
  }

  @Validate(editItemCartSchema)
  async editItemQ(req: Request, res: Response) {
    const item = req.body;
    if (!validateId(item.id))
      throw new RequestError(`id '${item.id}' is not valid`, HttpStatus.BadRequest);
    const cart = await getUserCart(req.userId!);
    const cartResult = await cart.editItemQuantity(item.id, item.quantity);
    if (cartResult.error) {
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Created, cartResult.result);
  }
}

export default new UserController();
