import { OrderData, OrderResult } from './interfaces';
import { AsyncSafeResult } from '@type/common';
import { InvalidDataError, UnauthorizedError } from '../errors';
import { AddressData } from '../address/interfaces';
import AddressModel from '@/database/models/address';
import CartModel, { CartDB } from '@/database/models/cart';
import OrderModel, { OrderDB } from '@/database/models/order';
import UserModel from '@/database/models/user';
import { getCartItemsInfo } from '../user/cart';

export async function createCashOrder(orderData: OrderData): AsyncSafeResult<OrderResult> {
  try {
    const address = await _getAddress(orderData.addressId);
    const user = await UserModel.findById(orderData.userId).populate<{ cart: CartDB | null }>(
      'cart',
    );
    if (!user) throw new InvalidDataError('Invalid User Id!');
    // TODO: Cart
    const cart = user.cart;
    if (!cart) throw new InvalidDataError('Cart Not exsits');
    if (cart.items.length === 0) {
      throw new InvalidDataError('Cart is empty!');
    }
    await cart.populate('items.product');
    console.log(cart);
    const items = cart.items.map(p => ({
      product: p.product._id,
      name: p.product.title,
      price: p.product.price,
      quantity: p.quantity,
      size: p.size,
      color: p.color,
    }));
    const totalPrice = getCartItemsInfo(cart).totalPrice;
    const order = await OrderModel.create({
      address,
      items,
      paymentMethod: 'CASH',
      price: totalPrice,
      tax: 0,
      totalPrice: totalPrice,
      totalQuantity: cart.totalQuantity,
      user: orderData.userId,
      phoneNumber: orderData.phoneNumber,
    });
    await CartModel.findByIdAndRemove(cart._id);
    await UserModel.findByIdAndUpdate(user._id, { $unset: { cart: '' } });
    return { result: _formatOrder(order), error: null };
  } catch (error) {
    console.log(error);
    return { error, result: null };
  }
}

export async function getAllOrder(userId: string): AsyncSafeResult<OrderResult[]> {
  try {
    const order = await OrderModel.find({ user: userId });
    return { result: order.map(o => _formatOrder(o)), error: null };
  } catch (error) {
    return { error, result: null };
  }
}

export async function getOrderByID(userId: string, orderId: string): AsyncSafeResult<OrderResult> {
  try {
    const order = await OrderModel.findById(orderId);
    if (!order) throw new InvalidDataError('Invalid Order Id!');
    if (order.user.toString() !== userId) throw new UnauthorizedError();
    return { result: _formatOrder(order), error: null };
  } catch (error) {
    return { error, result: null };
  }
}

export async function getOrderForAdmin(id: string): AsyncSafeResult<OrderDB> {
  try {
    const order = await OrderModel.findById(id);
    if (!order) throw new InvalidDataError('Invalid Order Id!');
    return { result: order.toJSON(), error: null };
  } catch (error) {
    return { error, result: null };
  }
}

export async function getOrderItems(userId: string, orderId: string): AsyncSafeResult<unknown[]> {
  try {
    const order = await OrderModel.findById(orderId);
    if (!order) throw new InvalidDataError('Invalid Order Id!');
    if (order.user.toString() !== userId) throw new UnauthorizedError();
    return { result: order.items, error: null };
  } catch (error) {
    return { error, result: null };
  }
}

type GetAddress = Promise<Omit<AddressData, 'isPrimary'>>;

async function _getAddress(addressData: string): GetAddress {
  const addressDB = await AddressModel.findById(addressData);
  if (!addressDB) throw new InvalidDataError('Invalid Address data!');
  return {
    city: addressDB.city,
    postalCode: addressDB.postalCode,
    state: addressDB.state,
  };
}

function _formatOrder(order: OrderDB): OrderResult {
  return {
    id: order._id,
    address: order.address,
    paymentMethod: order.paymentMethod,
    price: order.price,
    tax: order.tax,
    totalPrice: order.totalPrice,
    totalQuantity: order.totalPrice,
  };
}
