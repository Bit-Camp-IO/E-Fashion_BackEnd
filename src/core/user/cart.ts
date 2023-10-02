import CartModel, { CartDB } from '@/database/models/cart';
import { AsyncSafeResult } from '@type/common';
import { CartItemData, CartResult } from './interfaces';
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

  static async createCart(): Promise<CartDB> {
    return await CartModel.create({});
  }

  async addItem(item: CartItemData): AsyncSafeResult<CartResult> {
    try {
      const product = await ProductModel.findById(item.id);
      if (!product) {
        throw new NotFoundError('Product');
      }
      const itemIndex = this.cart.items.findIndex(
        i =>
          i.product.toString() === product._id.toString() &&
          item.color === i.color &&
          item.size === i.size,
      );
      if (itemIndex !== -1) {
        this.cart.items[itemIndex].quantity += item.quantity;
      } else {
        const cartItem = {
          product: product._id,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        };
        this.cart.items.push(cartItem);
      }
      this.cart.totalQuantity += item.quantity;
      // this.cart.totalPrice += Number((item.quantity * product.price).toFixed(2));
      await this.cart.save();
      return { result: await this._formatCart(), error: null };
    } catch (err) {
      console.log(err);
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
        // this.cart.totalPrice = 0;
      } else {
        this.cart.totalQuantity -= item.quantity;
        // this.cart.totalPrice -= Number((item.price * item.quantity).toFixed(2));
      }
      await this.cart.save();
      return null;
    } catch (err) {
      return err;
    }
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
      // this.cart.totalPrice += Number((qdi * newItem.price).toFixed(2));
      await this.cart.save();
      return { result: await this._formatCart(), error: null };
    } catch (err) {
      return { error: err, result: null };
    }
  }

  async getCart(): Promise<CartResult> {
    return await this._formatCart();
  }

  private async _formatCart(): Promise<CartResult> {
    await this.cart.populate('items.product');
    const { totalPrice } = getCartItemsInfo(this.cart);
    return {
      items: this.cart.items.map(i => ({
        color: i.color,
        productId: i.product._id,
        quantity: i.quantity,
        size: i.size,
        imageUrl: i.product.imageURL,
      })),
      subtotal: totalPrice,
      totalQuantity: this.cart.totalQuantity,
      tax: 0,
      total: totalPrice,
    };
  }
}

export function getCartItemsInfo(cart: CartDB) {
  let result: { totalPrice: number } = { totalPrice: 0 };
  for (const i of cart.items) {
    if (typeof i.product === 'string') continue;
    result.totalPrice += i.product.price * i.quantity;
  }
  return result;
}
