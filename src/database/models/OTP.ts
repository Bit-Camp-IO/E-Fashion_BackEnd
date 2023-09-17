import mongoose, { Schema } from 'mongoose';

export enum OTPType {
  FORGOT_PASSWORD = 1,
  EMAIL_VERIFICATION,
}

export interface OTP_DB
  extends mongoose.Document,
    mongoose.ResolveTimestamps<{ createdAt: Date; updatedAt: Date }, { timestamps: true }> {
  code: string;
  email: string;
  expireAt: Date;
  otpType: OTPType;
}

const otpSchema = new Schema<OTP_DB>(
  {
    code: {
      type: String,
      required: true,
    },
    email: { type: String, required: true },
    expireAt: {
      type: Date,
      default: new Date(),
    },
    otpType: {
      type: Number,
      required: true,
      enum: [OTPType.EMAIL_VERIFICATION, OTPType.FORGOT_PASSWORD],
    },
  },
  { timestamps: true },
);
otpSchema.index({ expireAt: 1 }, { expireAfterSeconds: 60 * 60 });
const OTPModel = mongoose.model('OTP', otpSchema);

export default OTPModel;
