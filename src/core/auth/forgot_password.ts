import UserModel from '@/database/models/user';
import { AppError } from '../errors';
import bcrypt from 'bcrypt';
import { validateOTP } from './otp';
import { OTPType } from '@/database/models/OTP';

interface ResetPasswordData {
  email: string;
  newPassword: string;
  otp: string;
}

export async function resetPassword(data: ResetPasswordData): Promise<Error | null> {
  try {
    const user = await UserModel.findOne({ email: data.email }).select('+password');
    if (!user) {
      throw AppError.invalid(
        'The provided email address is not valid or does not exist in our system.',
      );
    }
    const isValidated = await validateOTP(data.otp, user.email, OTPType.FORGOT_PASSWORD, true);
    if (!isValidated) {
      throw AppError.invalid('The provided OTP is not valid or has expired.');
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 12);
    user.password = hashedPassword;
    await user.save();
    return null;
  } catch (error) {
    return error;
  }
}
