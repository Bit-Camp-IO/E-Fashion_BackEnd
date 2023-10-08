import { AsyncSafeResult } from '@type/common';
import { OrderPaymentMethod, OrderResult, PaymentIntents } from './interfaces';
import { OrderPayment } from './order';
import { InvalidDataError, NotFoundError } from '../errors';
import { createPaymnetIntents } from '../payment/stripe';
import CollectionModel from '@/database/models/collection';
import OrderModel from '@/database/models/order';
import * as Helper from './helper';

export class CollectionOrder extends OrderPayment {
  constructor(userId: string, private collectionId: string) {
    super(userId);
  }
  async getClientSecret(): AsyncSafeResult<PaymentIntents> {
    try {
      const user = await this.getUserWithAddress();
      let clientSecret: string | null = null;
      const price = await this.getCollectionPrice();
      clientSecret = await createPaymnetIntents({
        userId: user._id.toString(),
        totalPrice: price,
        collectionId: this.collectionId,
      });
      if (!clientSecret) {
        throw new Error();
      }
      return { result: { clientSecret }, error: null };
    } catch (error) {
      return { error, result: null };
    }
  }
  async getCollectionPrice() {
    const collection = await CollectionModel.findById(this.collectionId);
    if (!collection) throw new NotFoundError('Collection ');

    return collection.price;
  }
  async cash(): AsyncSafeResult<OrderResult> {
    return this.createOrder('CASH');
  }
  async stripe(): AsyncSafeResult<OrderResult> {
    return this.createOrder('STRIPE');
  }

  private async createOrder(method: OrderPaymentMethod): AsyncSafeResult<OrderResult> {
    try {
      const user = await this.getUserWithAddress();
      const collection = await CollectionModel.findById(this.collectionId);
      if (!collection) throw new InvalidDataError('Invalid collection id');
      const order = await OrderModel.create({
        address: {
          latitude: user.address.latitude,
          longitude: user.address.longitude,
        },
        paymentMethod: method,
        price: collection.price,
        tax: 0,
        totalPrice: collection.price,
        totalQuantity: 1,
        user: this.userId,
        phoneNumber: user.phoneNumber,
        item_type: 'collection',
        collection_item: {
          collectionId: collection._id,
          name: collection.title,
          price: collection.price,
        },
      });
      return { result: Helper._formatOrder(order), error: null };
    } catch (error) {
      return { error, result: null };
    }
  }
}
