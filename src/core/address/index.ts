import AddressModel, { AddressDB } from '@/database/models/address';
import { AddAddressData, AddressData } from './interfaces';
import UserModel from '@/database/models/user';
import { AsyncSafeResult } from '@type/common';
import { NotFoundError } from '../errors';

export async function addAddress(
  id: string,
  addressData: AddAddressData,
): AsyncSafeResult<AddressResult> {
  try {
    const address = await AddressModel.create(addressData);
    const user = await UserModel.findByIdAndUpdate(id, { $addToSet: { addresses: address } });
    if (!user) {
      throw new NotFoundError('User with id' + id);
    }

    return { result: _formatAddress(address), error: null };
  } catch (err) {
    return { error: err, result: null };
  }
}

export interface AddressResult extends AddressData {
  id: string;
}

export async function getUserAddresses(userId: string): AsyncSafeResult<AddressResult[]> {
  try {
    const user = await UserModel.findById(userId, { addresses: 1 }).populate<{
      addresses: AddressDB[];
    }>('addresses');
    if (!user) throw new NotFoundError('User');
    return { error: null, result: user.addresses.map(_formatAddress) };
  } catch (error) {
    return { error, result: null };
  }
}

export async function removeAddress(id: string, addressId: string): Promise<null | Error> {
  try {
    const user = await UserModel.findByIdAndUpdate(id, { $pull: { addresses: addressId } });
    if (!user) {
      throw new NotFoundError('User with id' + id);
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
      longitude: add.longitude
    }
  };
}
