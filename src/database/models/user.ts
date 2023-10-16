import mongoose, { Schema } from 'mongoose';
import { AddressDB } from './address';
import { CartDB } from './cart';
import { PaymentDB } from './payment';
import { ObjectId, Relation, RelationList } from '@type/database';
import { ProductDB } from './product';

export type AuthProvider = 'LOCAL' | 'GOOGLE';

export interface UserDB extends mongoose.Document {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  provider: AuthProvider;
  settings: SettingsDB;
  banned: boolean;
  isVerified: boolean;
  address: Relation<AddressDB>;
  cart: Relation<CartDB>;
  payments: RelationList<PaymentDB>;
  favorites: RelationList<ProductDB>;
  profileImage: string;
  devices: string[];
}

interface SettingsDB {
  language: 'en' | 'ar';
  notification: boolean;
}

const defaultSetting: SettingsDB = {
  language: 'en',
  notification: true,
};

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
        language: {
          type: String,
          enum: ['en', 'ar'],
          default: 'en',
        },
        notification: {
          type: Boolean,
        },
      },
      _id: false,
      default: defaultSetting,
    },
    address: { type: ObjectId, ref: 'Address' },
    cart: { type: ObjectId, ref: 'Cart' },
    payments: [{ type: ObjectId, ref: 'Payment' }],
    isVerified: {
      type: Boolean,
      default: false,
    },
    favorites: [{ type: ObjectId, ref: 'Product', default: [] }],
    profileImage: String,
    devices: [{ type: String }],
  },
  { timestamps: true },
);

const UserModel = mongoose.model('User', userSchema);

interface UserRegistrationData {
  email: string;
  fullName: string;
  phone?: string;
}

interface UserRegistrationLocalData extends UserRegistrationData {
  provider: 'LOCAL';
  hashPassword: string;
}

interface UserRegistrationGOOGLEData extends UserRegistrationData {
  provider: 'GOOGLE';
}

export type UserRegistration = UserRegistrationLocalData | UserRegistrationGOOGLEData;

export default UserModel;
