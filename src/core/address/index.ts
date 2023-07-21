import AddressModel from "@/database/models/address";
import { AddressData } from "./interfaces";
import UserModel from "@/database/models/user";
import { NotFoundError } from "../errors";
import { AsyncSafeResult } from "@type/common";
import { UserResult } from "../user/interfaces";

export async function addAdress(id: string, addressData: AddressData): AsyncSafeResult<UserResult> {
    try {
        const address = await AddressModel.create(addressData);
        const user = await UserModel.findByIdAndUpdate(id, { $push: { addresses: address } }, { new: true });
        if (!user) {
            throw new NotFoundError("User with id" + id);
        }
        const result: UserResult = {
            email: user.email,
            fullName: user.fullName,
            isVerified: user.isVerified,
            provider: user.provider,
            settings: user.settings,
            profile: user.profileImage,
            addresses: user.addresses
          };
        return { result: result, error: null };
    } catch (err) {
        return { error: err, result: null };
    }
}

export async function removeAddress(id: string, addressId: string) {
    try {
        const user = await UserModel.findByIdAndUpdate(id, { $pull: { addresses: addressId } });
        if (!user) {
            throw new NotFoundError("User with id" + id);
        }
        return { result: user, error: null };
    } catch (err) {
        return { error: err, result: null };
    }
}