import UserModel from '@/database/models/user';
import { AsyncSafeResult } from '@type/common';
import { NotFoundError } from '../errors';
import ProductModel, { ProductDB } from '@/database/models/product';
import { FavItem, UserResult } from './interfaces';
import { Cart } from './cart';
import { CartDB } from '@/database/models/cart';
import { removeFile } from '../utils';
interface UserServices {
  // addToCart(id: string): Promise<Error | null>;
  addToFav(prId: string): AsyncSafeResult<FavItem[]>;
}

interface ProfileImageResult {
  path: string;
}

export class User implements UserServices {
  constructor(private _id: string) {}
  async addToFav(prId: string): AsyncSafeResult<FavItem[]> {
    try {
      const product = await ProductModel.findById(prId);
      if (!product) return { error: new NotFoundError('Product with id ' + prId), result: null };
      let user = await UserModel.findByIdAndUpdate(
        this._id,
        {
          $addToSet: { favorites: product._id },
        },
        { new: true },
      )
        .populate<{ favorites: ProductDB[] }>('favorites')
        .exec();
      if (!user) return { error: new NotFoundError('User with id ' + this._id), result: null };
      const result: FavItem[] = user.favorites.map(f => ({
        id: f._id,
        title: f.title,
        price: f.price,
      }));
      return { result: result, error: null };
    } catch (err) {
      return { error: err, result: null };
    }
  }
  async removeFav(id: string): Promise<Error | null> {
    try {
      await UserModel.findByIdAndUpdate(this._id, { $pull: { favorites: id } });
      return null;
    } catch (err) {
      return err;
    }
  }
  async myFav(): AsyncSafeResult<FavItem[]> {
    try {
      const user = await UserModel.findById(this._id)
        .populate<{ favorites: ProductDB[] }>('favorites')
        .exec();
      if (!user) return { error: new NotFoundError('User with id ' + this._id), result: null };
      const result: FavItem[] = user.favorites.map(f => ({
        title: f.title,
        price: f.price,
        id: f._id,
      }));
      return { result: result, error: null };
    } catch (err) {
      return { error: err, result: null };
    }
  }
  async getMyCart(): AsyncSafeResult<Cart> {
    try {
      const user = await UserModel.findById(this._id)
        .populate<{ favorites: CartDB }>('cart')
        .exec();
      if (!user) return { error: new NotFoundError('User with id ' + this._id), result: null };
      let cart = user.cart;
      if (!cart) {
        cart = await Cart.createCart();
        user.cart = cart._id;
        await user.save();
      }
      return { result: new Cart(cart), error: null };
    } catch (err) {
      return { error: err, result: null };
    }
  }
  async me(): AsyncSafeResult<UserResult> {
    try {
      const user = await UserModel.findById(this._id).select([
        'email',
        'fullName',
        'isVerified',
        'provider',
        'settings',
        'profileImage',
      ]);
      if (!user) return { error: new NotFoundError('User with id ' + this._id), result: null };
      const result: UserResult = {
        email: user.email,
        fullName: user.fullName,
        isVerified: user.isVerified,
        provider: user.provider,
        settings: user.settings,
        profile: user.profileImage,
      };
      return { result, error: null };
    } catch (err) {
      return { error: err, result: null };
    }
  }
  async updateProfileImage(path: string): AsyncSafeResult<ProfileImageResult> {
    try {
      const user = await UserModel.findByIdAndUpdate(this._id, { $set: { profileImage: path } });
      if (!user) {
        throw new NotFoundError('User With id ' + this._id);
      }
      await removeFile(user.profileImage);
      return { error: null, result: { path: path } };
    } catch (err) {
      return { error: err, result: null };
    }
  }
}

// export async function getUser(id: string): AsyncSafeResult<User> {
//   try {
//     const userDoc = await UserModel.findById(id);
//     if (!userDoc) return { error: new NotFoundError('User with id ' + id), result: null };
//     const user = new User(userDoc);
//     return { error: null, result: user };
//   } catch (err) {
//     return { error: err, result: null };
//   }
// }
