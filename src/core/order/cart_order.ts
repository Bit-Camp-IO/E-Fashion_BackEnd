import { AsyncSafeResult } from '@type/common';
import { OrderPaymentMethod, OrderResult, PaymentIntents } from './interfaces';
import { OrderPayment } from './order';
import UserModel, { UserDB } from '@/database/models/user';
import CartModel, { CartDB } from '@/database/models/cart';
import { InvalidDataError } from '../errors';
import { getCartItemsInfo } from '../user/cart';
import { createPaymnetIntents } from '../payment/stripe';
import OrderModel from '@/database/models/order';
import * as Helper from './helper';

export class CartOrder extends OrderPayment {
  constructor(userId: string) {
    super(userId);
  }
  async getClientSecret(): AsyncSafeResult<PaymentIntents> {
    try {
      const user = await this.getUserWithAddress(); // will throw error if user don't have address

      let clientSecret: string | null = null;
      const { totalPrice } = await this.populateCart(user);
      clientSecret = await createPaymnetIntents({
        userId: user._id.toString(),
        totalPrice: totalPrice,
      });
      if (!clientSecret) {
        throw new Error();
      }
      return { result: { clientSecret }, error: null };
    } catch (error) {
      return { error, result: null };
    }
  }
  private async populateCart(
    user: UserDB,
  ): Promise<{ totalPrice: number; user: UserDB; cart: CartDB }> {
    await user.populate<{ cart: CartDB | null }>('cart');
    const cart = user.cart;
    if (!cart) throw new InvalidDataError('Cart Not exsits');
    if (cart.items.length === 0) {
      throw new InvalidDataError('Cart is empty!');
    }
    await cart.populate('items.product');
    const totalPrice = getCartItemsInfo(cart).totalPrice;
    return { totalPrice, user, cart };
  }

  async cash() {
    return this.createOrder('CASH');
  }

  async stripe() {
    return this.createOrder('STRIPE');
  }

  private async createOrder(method: OrderPaymentMethod): AsyncSafeResult<OrderResult> {
    try {
      const user = await this.getUserWithAddress();
      const { cart, totalPrice } = await this.populateCart(user);
      const items = cart.items.map(p => ({
        product: p.product._id,
        name: p.product.title,
        price: p.product.price,
        quantity: p.quantity,
        size: p.size,
        color: p.color,
      }));
      const order = await OrderModel.create({
        address: {
          latitude: user.address.latitude,
          longitude: user.address.longitude,
        },
        items,
        paymentMethod: method,
        price: totalPrice,
        tax: 0,
        totalPrice: totalPrice,
        totalQuantity: cart.totalQuantity,
        user: this.userId,
        phoneNumber: user.phoneNumber,
        item_type: 'cart',
      });
      await CartModel.findByIdAndRemove(cart._id);
      await UserModel.findByIdAndUpdate(user._id, { $unset: { cart: '' } });
      return { result: Helper._formatOrder(order), error: null };
    } catch (error) {
      return { error, result: null };
    }
  }
}
