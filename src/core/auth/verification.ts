import UserModel, { UserDB } from '@/database/models/user';
import { AsyncSafeResult } from '@type/common';
import { InvalidDataError } from '../errors';
import { OTPType } from '@/database/models/OTP';
import { createOTP, validateOTP } from './otp';

export async function createEmailVerificationOTP(
  id: string,
): AsyncSafeResult<{ otp: string; user: UserDB }> {
  try {
    const user = await UserModel.findById(id);
    if (!user) {
      throw new InvalidDataError('Invalid user id');
    }
    if (user.isVerified) {
      throw new InvalidDataError('User email is verified');
    }
    const otp = await createOTP(user.email, OTPType.EMAIL_VERIFICATION);
    return { result: { otp, user }, error: null };
  } catch (error) {
    return { error, result: null };
  }
}

export async function verifyUserEmail(userId: string, otp: string): Promise<Error | null> {
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new InvalidDataError('Invalid user id');
    }
    const isValidated = validateOTP(otp, user.email, OTPType.EMAIL_VERIFICATION);
    if (!isValidated) {
      throw new InvalidDataError('Invalid OTP');
    }
    user.isVerified = true;
    await user.save();
    return null;
  } catch (error) {
    return error;
  }
}
