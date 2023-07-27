import { createOrder, getAllOrder, getOrderByID, getOrderItems } from '@/core/order';
import { Controller, Validate } from '@server/decorator';
import RequestError from '@server/utils/errors';
import { HttpStatus } from '@server/utils/status';
import { Request, Response } from 'express';
import { OrderSchema, orderSchema } from './order.valid';
import { OrderData, OrderPayment } from '@/core/order/interfaces';
import { validateId } from '@/core/utils';
import { InvalidDataError } from '@/core/errors';

@Controller()
class OrderController {
  @Validate(orderSchema)
  async create(req: Request, res: Response) {
    const body: OrderSchema = req.body;
    if (validateId(body.cartId)) throw new RequestError('Invalid cartId', HttpStatus.BadRequest);
    const payment: OrderPayment =
      typeof body.payment === 'string'
        ? body.payment
        : !body.payment
        ? body.payment
        : {
            ...body.payment,
            method: body.payment.cardName[1] === '4' ? 'VISA' : 'MASTERCARD',
          };

    const orderPayload: OrderData = {
      address: body.address,
      cartId: body.cartId,
      payment: payment,
      paymentMethod: body.paymentMethod,
      phoneNumber: body.phoneNumber,
      userId: req.userId!,
    };
    const order = await createOrder(orderPayload);
    if (order.error) {
      if (order.error instanceof InvalidDataError)
        throw new RequestError(order.error.message, HttpStatus.BadRequest);
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Created, order.result);
  }
  async getAll(req: Request, res: Response) {
    const orders = await getAllOrder(req.userId!);
    if (orders.error) {
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Ok, orders.result);
  }
  async getOne(req: Request, res: Response) {
    const id = req.body['id'];
    if (!validateId(id)) throw new RequestError(`id '${id}' is not valid`, HttpStatus.BadRequest);
    const order = await getOrderByID(req.userId!, id);
    if (order.error) {
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Ok, order.result);
  }
  async getItems(req: Request, res: Response) {
    const id = req.body['id'];
    if (!validateId(id)) throw new RequestError(`id '${id}' is not valid`, HttpStatus.BadRequest);
    const items = await getOrderItems(req.userId!, id);
    if (items.error) {
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Ok, items.result);
  }
}

export default new OrderController();
