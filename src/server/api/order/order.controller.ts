import { createOrder, getAllOrder, getOrderByID, getOrderItems } from '@/core/order';
import { Controller, Validate } from '@server/decorator';
import RequestError from '@server/utils/errors';
import { HttpStatus } from '@server/utils/status';
import { Request, Response } from 'express';
import { createOrderSchema } from './order.valid';
import { OrderData } from '@/core/order/interfaces';
import { validateId } from '@/core/utils';

@Controller()
class OrderController {
  @Validate(createOrderSchema)
  async create(req: Request, res: Response) {
    const body: OrderData = req.body;
    const order = await createOrder({...body, userId: req.userId!});
    if (order.error) {
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Created, order.result);
  }
  async getAll(req: Request, res: Response) {
    const orders = await getAllOrder(req.userId!);
    if (orders.error) {
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Ok, orders.result)
  }
  async getOne(req: Request, res: Response) {
    const id = req.body['id'];
    if (!validateId(id)) throw new RequestError(`id '${id}' is not valid`, HttpStatus.BadRequest);
    const order = await getOrderByID(req.userId!, id);
    if (order.error) {
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Ok, order.result)
  }
  async getItems(req: Request, res: Response) {
    const id = req.body['id'];
    if (!validateId(id)) throw new RequestError(`id '${id}' is not valid`, HttpStatus.BadRequest);
    const items = await getOrderItems(req.userId!, id);
    if (items.error) {
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Ok, items.result)
  }
}

export default new OrderController();
