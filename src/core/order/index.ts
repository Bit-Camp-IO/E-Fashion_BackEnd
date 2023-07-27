import PaymentModel from '@/database/models/payment';
import { PaymentData } from '../payment/interface';
import { OrderAddress, OrderData, OrderPayment, OrderResult } from './interfaces';
import { AsyncSafeResult } from '@type/common';
import { InvalidDataError, UnauthorizedError } from '../errors';
import { AddressData } from '../address/interfaces';
import AddressModel from '@/database/models/address';
import CartModel from '@/database/models/cart';
import OrderModel, { OrderDB } from '@/database/models/order';
import UserModel from '@/database/models/user';

export async function createOrder(orderData: OrderData): AsyncSafeResult<OrderResult> {
  try {
    const payment = _getPayment(orderData.paymentMethod, orderData.payment);
    const address = _getAddress;
    const user = await UserModel.findById(orderData.userId);
    if (!user) throw new InvalidDataError('Invalid User Id!');
    const cart = await CartModel.findById(orderData.cartId);
    if (!cart) throw new InvalidDataError('Invalid Cart Id!');
    const order = await OrderModel.create({
      address,
      payment,
      paymentMethod: orderData.paymentMethod,
      items: cart.items,
      price: cart.totalPrice,
      tax: 0,
      totalPrice: cart.totalPrice,
      totalQuantity: cart.totalQuantity,
      user: orderData.userId,
    });
    await CartModel.findByIdAndRemove(cart._id);
    await UserModel.findByIdAndUpdate(user._id, { $unset: { cart: '' } });
    return { result: _formatOrder(order), error: null };
  } catch (error) {
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

type GetPayment = Promise<PaymentData | undefined>;

async function _getPayment(paymentMethod: string, paymentData: OrderPayment): GetPayment {
  if (paymentMethod === 'CASH') return undefined;
  if (!['VISA', 'MASTERCARD'].includes(paymentMethod))
    throw new InvalidDataError('Invalid Payment Method!');
  if (typeof paymentData !== 'string') {
    if (!paymentData) throw new InvalidDataError('paymnet required!');
    return paymentData;
  }
  const paymentDb = await PaymentModel.findById(paymentData);
  if (!paymentDb) throw new InvalidDataError('Invalid Payment data!');
  return {
    cardName: paymentDb.cardName!,
    cardNumber: paymentDb.cardNumber!,
    cvv: paymentDb.cvv!,
    exMonth: paymentDb.exMonth!,
    exYear: paymentDb.exYear!,
    method: paymentDb.method as 'VISA' | 'MASTERCARD',
    provider: paymentDb.provider!,
  };
}

type GetAddress = Promise<Omit<AddressData, 'isPrimary'>>;

async function _getAddress(addressData: OrderAddress): GetAddress {
  if (typeof addressData !== 'string') return addressData;
  const addressDB = await AddressModel.findById(addressData);
  if (!addressDB) throw new InvalidDataError('Invalid Address data!');
  return {
    city: addressDB.city,
    phone: addressDB.phone,
    postalCode: addressDB.postalCode,
    state: addressDB.state,
  };
}

function _formatOrder(order: OrderDB): OrderResult {
  return {
    id: order._id,
    address: order.address,
    payment: order.payment,
    paymentMethod: order.paymentMethod,
    price: order.price,
    tax: order.tax,
    totalPrice: order.totalPrice,
    totalQuantity: order.totalPrice,
  };
}
