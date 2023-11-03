import AddressModel, { AddressDB } from '@/database/models/address';
import { AddAddressData, AddressResult } from './interfaces';
import UserModel from '@/database/models/user';
import { AsyncSafeResult } from '../types';
import { AppError } from '../errors';

export * from './interfaces';

export async function addAddress(
  id: string,
  addressData: AddAddressData,
): AsyncSafeResult<AddressResult> {
  try {
    const address = await AddressModel.create(addressData);
    const user = await UserModel.findByIdAndUpdate(
      id,
      { $set: { address: address } },
      { new: true },
    );
    if (!user) {
      throw AppError.unauthorized();
    }
    return { result: _formatAddress(address), error: null };
  } catch (err) {
    return { error: err, result: null };
  }
}

export async function getUserAddress(userId: string): AsyncSafeResult<AddressResult> {
  try {
    const user = await UserModel.findById(userId, { address: 1 }).populate<{
      address: AddressDB;
    }>('address');
    if (!user) {
      throw AppError.unauthorized();
    }
    if (!user.address) throw AppError.notFound('Address not found.');
    return { error: null, result: _formatAddress(user.address) };
  } catch (error) {
    return { error, result: null };
  }
}

export async function removeAddress(id: string, addressId: string): Promise<null | Error> {
  try {
    const user = await UserModel.findByIdAndUpdate(id, { $unset: { address: 1 } });
    if (!user) {
      throw AppError.unauthorized();
    }
    await AddressModel.findByIdAndRemove(addressId);
    return null;
  } catch (err) {
    return err;
  }
}

function _formatAddress(add: AddressDB): AddressResult {
  return {
    id: add._id,
    isPrimary: add.isPrimary,
    location: {
      latitude: add.latitude,
      longitude: add.longitude,
    },
  };
}
