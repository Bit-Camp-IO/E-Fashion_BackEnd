import { AsyncSafeResult } from '@type/common';
import { OrderResult, PaymentIntents } from './interfaces';
import { InvalidDataError, UnauthorizedError } from '../errors';
import UserModel, { UserDB } from '@/database/models/user';

export abstract class OrderPayment {
  constructor(protected userId: string) {}
  abstract getClientSecret(): AsyncSafeResult<PaymentIntents>; // Stripe id
  abstract cash(): AsyncSafeResult<OrderResult>; // Cash
  abstract stripe(): AsyncSafeResult<OrderResult>; // stripe
  protected async getUserWithAddress(): Promise<UserDB> {
    const user = await UserModel.findById(this.userId).populate('address');
    if (!user) {
      throw new UnauthorizedError();
    }
    if (!user.phoneNumber) {
      throw new InvalidDataError(
        'The phone number is required in the user data before order request. Ensure that user has address and try your request again.',
      );
    }
    if (!user.address)
      throw new InvalidDataError(
        'The address is required in the user data before order request. Ensure that user has address and try your request again.',
      );
    return user;
  }
}
