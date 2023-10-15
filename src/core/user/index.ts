import UserModel, { UserDB } from '@/database/models/user';
import { AsyncSafeResult } from '@type/common';
import { InvalidCredentialsError, InvalidDataError, NotFoundError } from '../errors';
import ProductModel, { ProductDB } from '@/database/models/product';
import { FavItem, UserResult } from './interfaces';
import { Cart } from './cart';
import { CartDB } from '@/database/models/cart';
import { removeFile } from '../utils';
import { AddAddressData } from '../address/interfaces';
import { AddressResult, addAddress, getUserAddress, removeAddress } from '../address';
import { join } from 'path';
import Config from '@/config';
import bcrypt from 'bcrypt';

interface UserServices {
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
      const user = await UserModel.findById(this._id).populate<{ cart: CartDB }>('cart').exec();
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
      const user = await UserModel.findById(this._id);
      if (!user) return { error: new NotFoundError('User with id ' + this._id), result: null };
      const result: UserResult = _formatUser(user);
      return { result, error: null };
    } catch (err) {
      return { error: err, result: null };
    }
  }

  async editMe(data: any): AsyncSafeResult<UserResult> {
    try {
      const user = await UserModel.findByIdAndUpdate(this._id, data, { new: true });
      if (!user) {
        throw new InvalidDataError('Invalid user data');
      }
      return { result: _formatUser(user), error: null };
    } catch (error) {
      return { error, result: null };
    }
  }

  async updateProfileImage(path: string): AsyncSafeResult<ProfileImageResult> {
    try {
      const user = await UserModel.findByIdAndUpdate(this._id, { $set: { profileImage: path } });
      if (!user) {
        throw new NotFoundError('User With id ' + this._id);
      }
      await removeFile(join(Config.ProfileImagesDir + user.profileImage));
      return { error: null, result: { path: path } };
    } catch (err) {
      return { error: err, result: null };
    }
  }

  async changePassword(data: { oldPassword: string; newPassword: string }): Promise<Error | null> {
    try {
      const user = await UserModel.findById(this._id).select('+password').exec();
      if (!user) {
        throw new NotFoundError('User With id ' + this._id);
      }
      const validPass = await bcrypt.compare(data.oldPassword, user?.password);
      if (!validPass) {
        throw new InvalidCredentialsError('Invalid old password');
      }
      const hashedPassword = await bcrypt.hash(data.newPassword, 12);
      user.password = hashedPassword;
      await user.save();
      return null;
    } catch (error) {
      return error;
    }
  }

  async getAddress(): AsyncSafeResult<AddressResult> {
    return getUserAddress(this._id);
  }

  async addNewAddress(addressData: AddAddressData): AsyncSafeResult<any> {
    return addAddress(this._id, addressData);
  }

  async removeAddress(addressId: string): Promise<Error | null> {
    return await removeAddress(this._id, addressId);
  }
}

function _formatUser(user: UserDB): UserResult {
  return {
    id: user._id,
    email: user.email,
    fullName: user.fullName,
    isVerified: user.isVerified,
    provider: user.provider,
    settings: user.settings,
    profile: user.profileImage,
    address: user.address,
    phoneNumber: user.phoneNumber,
  };
}
