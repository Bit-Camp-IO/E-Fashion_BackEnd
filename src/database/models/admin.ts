import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface AdminDB {
  fullName: string;
  email: string;
  password: string;
  // TODO: Create admin roles enum
  role: string;
  phone: string;
  address: string;
  isVerified: boolean;
}

const adminSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // To prevent password from being returned in query results
    },
    role: {
      type: String,
      enum: ['admin', 'superadmin'],
      default: 'admin',
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Admin', adminSchema);
