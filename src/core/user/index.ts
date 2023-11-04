import UserModel, { UserDB } from '@/database/models/user';
import { AsyncSafeResult } from '../types';
import { AppError, ErrorType } from '../errors';
import { UserResult } from './interfaces';
import { Cart } from './cart';
import { CartDB } from '@/database/models/cart';
import { AddAddressData } from '../address/interfaces';
import { AddressResult, addAddress, getUserAddress, removeAddress } from '../address';
import { join } from 'node:path';
import Config from '@/config';
import bcrypt from 'bcrypt';
import { removeFile } from '../utils';

interface ProfileImageResult {
  path: string;
}

export class User {
  constructor(private _id: string) {}
  async getMyCart(): AsyncSafeResult<Cart> {
    try {
      const user = await UserModel.findById(this._id).populate<{ cart: CartDB }>('cart').exec();
      if (!user) throw AppError.unauthorized();
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
      if (!user) throw AppError.unauthorized();
      const result: UserResult = _formatUser(user);
      return { result, error: null };
    } catch (err) {
      return { error: err, result: null };
    }
  }

  async editMe(data: any): AsyncSafeResult<UserResult> {
    try {
      const user = await UserModel.findByIdAndUpdate(this._id, data, { new: true });
      if (!user) throw AppError.unauthorized();
      return { result: _formatUser(user), error: null };
    } catch (error) {
      return { error, result: null };
    }
  }

  async updateProfileImage(path: string): AsyncSafeResult<ProfileImageResult> {
    try {
      const user = await UserModel.findByIdAndUpdate(this._id, { $set: { profileImage: path } });
      if (!user) throw AppError.unauthorized();
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
        throw AppError.unauthorized();
      }

      const validPass = await bcrypt.compare(data.oldPassword, user?.password);
      if (!validPass) {
        throw new AppError(ErrorType.InvalidData, 'The provided old password is not valid.');
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
  async addDevice(devId: string): Promise<Error | null> {
    try {
      const user = await UserModel.findByIdAndUpdate(this._id, { $addToSet: { devices: devId } });
      if (!user) throw AppError.unauthorized();
      return null;
    } catch (err) {
      return err;
    }
  }
  async removeDevice(devId: string): Promise<Error | null> {
    try {
      let u: any;
      if (devId === 'all') {
        u = { $unset: { devices: [] } };
      } else {
        u = { $pull: { devices: devId } };
      }
      const user = await UserModel.findByIdAndUpdate(this._id, u);
      if (!user) throw AppError.unauthorized();
      return null;
    } catch (err) {
      return err;
    }
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
