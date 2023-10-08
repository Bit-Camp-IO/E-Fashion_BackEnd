import { OrderDB } from '@/database/models/order';
import { OrderResult } from './interfaces';

export function _formatOrder(order: OrderDB): OrderResult {
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
