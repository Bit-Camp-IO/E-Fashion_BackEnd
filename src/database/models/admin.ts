import { ObjectId, Relation } from '@type/database';
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
  addedBy: Relation<AdminDB>;
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
      select: false,
    },
    role: {
      type: String,
      enum: ['admin', 'superadmin', 'manager'],
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
    addedBy: {
      type: ObjectId,
      required: function (this: AdminDB) {
        return this.role !== 'manager';
      },
    },
  },
  { timestamps: true },
);

const AdminModel = mongoose.model('Admin', adminSchema);

export default AdminModel;
