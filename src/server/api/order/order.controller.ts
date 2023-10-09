import orderServices, { OrderPayment } from '@/core/order';
import { Controller, Validate } from '@server/decorator';
import RequestError from '@server/utils/errors';
import { HttpStatus } from '@server/utils/status';
import { Request, Response } from 'express';
import { OrderSchema, orderSchema } from './order.valid';
import { validateId } from '@/core/utils';
import { InvalidDataError, NotFoundError } from '@/core/errors';
// import { createCheckoutSessionURL } from '@/core/payment/stripe';

@Controller()
class OrderController {
  @Validate(orderSchema)
  async createCashOrder(req: Request, res: Response) {
    const body: OrderSchema = req.body;
    const type = req.query.type?.toString().toLowerCase();
    let orderSevices: OrderPayment = orderServices.orderPaymnet(type, {
      userId: req.userId!,
      ...body,
    });
    const order = await orderSevices.cash();
    if (order.error) {
      if (order.error instanceof InvalidDataError)
        throw new RequestError(order.error.message, HttpStatus.BadRequest);
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Created, order.result);
  }

  async getAll(req: Request, res: Response) {
    const orders = await orderServices.getAllOrder(req.userId!);
    if (orders.error) {
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Ok, orders.result);
  }

  async getOne(req: Request, res: Response) {
    const id = req.body['id'];
    if (!validateId(id)) throw new RequestError(`id '${id}' is not valid`, HttpStatus.BadRequest);
    const order = await orderServices.getOrderByID(req.userId!, id);
    if (order.error) {
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Ok, order.result);
  }

  async getItems(req: Request, res: Response) {
    const id = req.body['id'];
    if (!validateId(id)) throw new RequestError(`id '${id}' is not valid`, HttpStatus.BadRequest);
    const items = await orderServices.getOrderItems(req.userId!, id);
    if (items.error) {
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Ok, items.result);
  }

  @Validate(orderSchema)
  async paymentIntent(req: Request, res: Response) {
    const body: OrderSchema = req.body;
    const type = req.query.type?.toString().toLowerCase();
    let orderSevices: OrderPayment = orderServices.orderPaymnet(type, {
      userId: req.userId!,
      ...body,
    });
    const payment = await orderSevices.getClientSecret();
    if (payment.error) {
      if (payment.error instanceof NotFoundError || payment.error instanceof InvalidDataError) {
        throw new RequestError(payment.error.message, HttpStatus.BadRequest);
      }
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Created, payment.result);
  }
}

export default new OrderController();
