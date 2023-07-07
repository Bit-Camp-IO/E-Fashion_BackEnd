import Product, { ProductData, ProductResult } from '../product';
import { AsyncSafeResult } from '@type/common';
import { AdminData, AdminResult } from './interfaces';
import AdminModel from '@/database/models/admin';
import bcrypt from 'bcrypt';
import { DuplicateUserError } from '../errors';
interface AdminService {
  addProduct(data: ProductData): AsyncSafeResult<ProductResult>;
  deleteProduct(id: string): void;
  editProduct(id: string, data: Partial<ProductData>): AsyncSafeResult<ProductData>;

  banUser(id: string): void;
  unBanUser(id: string): void;
}

export class Admin implements AdminService {
  constructor(protected _id: string) {}
  async addProduct(data: ProductData): AsyncSafeResult<ProductResult> {
    try {
      const product = await Product.create(data, this._id);
      return { result: product, error: null };
    } catch (err) {
      return { error: err, result: null };
    }
  }
  // TODO: Admin Services
  async editProduct(_: string, __: Partial<ProductData>): AsyncSafeResult<ProductData> {
    try {
      throw new Error('not implemented');
    } catch (err) {
      return { error: err, result: null };
    }
  }

  deleteProduct(_: string): void {}

  banUser(_: string): void {}

  unBanUser(_: string): void {}
}

interface SuperAdminService {
  // TODO: Change Types
  createAdmin(adminData: AdminData): AsyncSafeResult<AdminResult>;
  removeAdmin(id: string): void;
}

export class SuperAdmin extends Admin implements SuperAdminService {
  constructor(id: string) {
    super(id);
  }
  // TODO: Super Admin Methods
  async createAdmin(data: AdminData): AsyncSafeResult<AdminResult> {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 12);
      const admin = await AdminModel.create({
        email: data.email,
        password: hashedPassword,
        address: data.address,
        name: data.name,
        role: 'admin',
        phone: data.phone,
        addedBy: this._id,
      });
      const result: AdminResult = {
        id: admin._id.toString(),
        name: admin.name,
        role: admin.role,
        createdAt: admin.createdAt,
      };
      return { error: null, result };
    } catch (err) {
      if (err.code === 11000) {
        err = new DuplicateUserError('Admin already exists');
      }
      return { error: err, result: null };
    }
  }
  removeAdmin(_: string): void {}
}
