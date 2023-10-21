import { OrderResult } from './interfaces';
import { AsyncSafeResult } from '@type/common';
import { InvalidDataError, NotFoundError, UnauthorizedError } from '../errors';
import OrderModel, { OrderDB } from '@/database/models/order';
import { CartOrder } from './cart_order';
import { validateId } from '../utils';
import { CollectionOrder } from './collection_order';
import { OrderPayment } from './order';
import * as Helper from './helper';

export * from './cart_order';
export * from './order';

type OrderFactoryData = {
  userId: string;
  collectionId?: string;
};

type OrderType = 'cart' | 'collection' | string | undefined;

export enum OrderStatus {
  PROGRESS = 1,
  WAY,
  DELIVERED,
}
export class OrderServices {
  async getAllOrder(userId: string): AsyncSafeResult<OrderResult[]> {
    try {
      const order = await OrderModel.find({ user: userId });
      return { result: order.map(o => Helper._formatOrder(o)), error: null };
    } catch (error) {
      return { error, result: null };
    }
  }
  async getOrderByID(userId: string, orderId: string): AsyncSafeResult<OrderResult> {
    try {
      const order = await OrderModel.findById(orderId);
      if (!order) throw new InvalidDataError('Invalid Order Id!');
      if (order.user.toString() !== userId) throw new UnauthorizedError();
      return { result: Helper._formatOrder(order), error: null };
    } catch (error) {
      return { error, result: null };
    }
  }

  async getOrderForAdmin(id: string): AsyncSafeResult<OrderDB> {
    try {
      const order = await OrderModel.findById(id);
      if (!order) throw new InvalidDataError('Invalid Order Id!');
      return { result: order.toJSON(), error: null };
    } catch (error) {
      return { error, result: null };
    }
  }
  async getOrderItems(userId: string, orderId: string): AsyncSafeResult<unknown[]> {
    try {
      const order = await OrderModel.findById(orderId).populate('items.product');
      if (!order) throw new InvalidDataError('Invalid Order Id!');
      if (order.user.toString() !== userId) throw new UnauthorizedError();
      return { result: order.items, error: null };
    } catch (error) {
      return { error, result: null };
    }
  }
  orderPayment(type: OrderType, o: OrderFactoryData): OrderPayment {
    if (type === 'cart') {
      return new CartOrder(o.userId!);
    } else if (type === 'collection') {
      if (!o.collectionId || !validateId(o.collectionId))
        throw new InvalidDataError('Invalid collection id');
      return new CollectionOrder(o.userId!, o.collectionId);
    } else {
      throw new InvalidDataError('Invalid order type');
    }
  }

  async changeOrderStatus(id: string, status: OrderStatus): AsyncSafeResult<OrderDB> {
    try {
      const order = await OrderModel.findByIdAndUpdate(id, { status }, { new: true });
      if (!order) {
        throw new NotFoundError('Order');
      }
      return { error: null, result: order.toJSON() };
    } catch (error) {
      return { error, result: null };
    }
  }
}

export default new OrderServices();
