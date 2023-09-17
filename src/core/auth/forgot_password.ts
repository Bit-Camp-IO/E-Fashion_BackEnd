import UserModel from '@/database/models/user';
import { InvalidDataError, NotFoundError } from '../errors';
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
      throw new NotFoundError('Email ');
    }
    const isValidated = validateOTP(data.otp, user.email, OTPType.EMAIL_VERIFICATION);
    if (!isValidated) {
      throw new InvalidDataError('Invalid OTP');
    }
    const hashedPassword = await bcrypt.hash(data.newPassword, 12);
    user.password = hashedPassword;
    await user.save();
    return null;
  } catch (error) {
    return error;
  }
}
