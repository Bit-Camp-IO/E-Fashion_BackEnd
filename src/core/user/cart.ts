import CartModel, { CartDB } from '@/database/models/cart';
import { AsyncSafeResult } from '@type/common';
import { CartItem, CartItemData, CartResult } from './interfaces';
import ProductModel from '@/database/models/product';
import { NotFoundError } from '../errors';
import { Types } from 'mongoose';

// export async function addItemToCart(cart: CartDB, item: CartItem): AsyncSafeResult<CartResult> {
//   try {
//     cart.items.push(item);
//     cart.totalQuantity += item.quantity;
//     cart.totalPrice += item.quantity * item.price;
//     await cart.save();
//     return { result: _formatCart(cart), error: null };
//   } catch (err) {
//     return { error: err, result: null };
//   }
// }

export class Cart {
  constructor(private cart: CartDB) {}
  async addItem(item: CartItemData): AsyncSafeResult<CartResult> {
    try {
      const product = await ProductModel.findById(item.id);
      if (!product) {
        return { error: new NotFoundError('Product '), result: null };
      }
      const cartItem: CartItem = {
        product: product._id,
        quantity: item.quantity,
        color: item.color,
        price: product.price,
        size: item.size,
        title: product.title,
      };
      this.cart.items.push(cartItem);
      this.cart.totalQuantity += item.quantity;
      this.cart.totalPrice += Number((item.quantity * product.price).toFixed(2));
      await this.cart.save();
      return { result: this._formatCart(), error: null };
    } catch (err) {
      return { error: err, result: null };
    }
  }
  async removeItem(id: string): Promise<Error | null> {
    try {
      const item = this.cart.items.find(i => i.product.toString() === id);
      if (!item) return new NotFoundError('Product with id ' + id);
      (this.cart.items as Types.DocumentArray<any>).pull({ product: id });
      if (this.cart.items.length === 1) {
        this.cart.totalQuantity = 0;
        this.cart.totalPrice = 0;
      } else {
        this.cart.totalQuantity -= item.quantity;
        this.cart.totalPrice -= Number((item.price * item.quantity).toFixed(2));
      }
      await this.cart.save();
      return null;
    } catch (err) {
      return err;
    }
  }
  static async createCart(): Promise<CartDB> {
    return await CartModel.create({});
  }
  async editItemQuantity(id: string, newQ: number): AsyncSafeResult<CartResult> {
    try {
      const itemIndex = this.cart.items.findIndex(i => i.product.toString() === id);
      if (itemIndex === -1)
        return { error: new NotFoundError('Product with id ' + id), result: null };
      const newItem = (this.cart.items as Types.DocumentArray<any>)[itemIndex];
      const qdi = newQ - newItem.quantity;
      newItem.quantity = newQ;
      (this.cart.items as Types.DocumentArray<any>).set(itemIndex, newItem);
      this.cart.totalQuantity += qdi;
      this.cart.totalPrice += Number((qdi * newItem.price).toFixed(2));
      await this.cart.save();
      return { result: this._formatCart(), error: null };
    } catch (err) {
      return { error: err, result: null };
    }
  }

  getCart(): CartResult {
    return this._formatCart();
  }

  private _formatCart(): CartResult {
    return {
      items: this.cart.items,
      subtotal: Number(this.cart.totalPrice.toFixed(2)),
      totalQuantity: this.cart.totalQuantity,
      tax: 0,
      total: Number(this.cart.totalPrice.toFixed(2)),
    };
  }
}
