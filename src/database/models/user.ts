import mongoose from 'mongoose';
import { AddressDB } from './address';
import { CartDB } from './cart';
import { PaymentDB } from './payment';
import { Relation, RelationList } from '@type/database';

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

export interface UserDB {
  email: string;
  password: string;
  phoneNumber: string;
  provider: 'LOCAL' | 'GOOGLE';
  settings: SettingsDB;
  fullName: string;
  banned: boolean;
  isVerified: boolean;
  addresses: RelationList<AddressDB>;
  cart: Relation<CartDB>;
  payments: RelationList<PaymentDB>;
}

interface SettingsDB {
  darkmode: 'dark' | 'light' | 'system';
  language: 'en' | 'ar';
}

const userSchema = new Schema<UserDB>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      select: false,
      required: function (this: UserDB) {
        return this.provider === 'LOCAL';
      },
    },
    fullName: {
      type: String,
      required: true,
      maxlength: 50,
    },
    phoneNumber: String,
    provider: {
      type: String,
      enum: ['GOOGLE', 'LOCAL'],
      required: true,
    },
    banned: {
      type: Boolean,
      default: false,
    },
    settings: {
      type: {
        darkmode: {
          type: String,
          enum: ['dark', 'light', 'system'],
          default: 'system',
        },
        language: {
          type: String,
          enum: ['en', 'ar'],
          default: 'ar',
        },
      },
    },
    addresses: [{ type: ObjectId, ref: 'Address' }],
    cart: { type: ObjectId, ref: 'Cart' },
    payments: [{ type: ObjectId, ref: 'Payment' }],
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const UserModel = mongoose.model('User', userSchema);
