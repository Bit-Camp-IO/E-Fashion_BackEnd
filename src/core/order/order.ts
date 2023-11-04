import { AsyncSafeResult } from '../types';
import { OrderResult, PaymentIntents } from './interfaces';
import { AppError } from '../errors';
import UserModel, { UserDB } from '@/database/models/user';

export abstract class OrderPayment {
  constructor(protected userId: string) {}
  abstract getClientSecret(): AsyncSafeResult<PaymentIntents>; // Stripe id
  abstract cash(): AsyncSafeResult<OrderResult>; // Cash
  abstract stripe(): AsyncSafeResult<OrderResult>; // stripe

  protected async getUserWithAddress(): Promise<UserDB> {
    const user = await UserModel.findById(this.userId).populate('address');
    if (!user) {
      throw AppError.unauthorized();
    }
    if (!user.phoneNumber) {
      throw AppError.invalid(
        'The phone number is required in the user data before order request. Ensure that user has address and try your request again.',
      );
    }
    if (!user.address)
      throw AppError.invalid(
        'The address is required in the user data before order request. Ensure that user has address and try your request again.',
      );
    return user;
  }
}
