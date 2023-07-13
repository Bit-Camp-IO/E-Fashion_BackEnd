import {ProductData, ProductItemApi, ProductResult, createProduct, getProductsList, removeProduct} from '../product';
import {AsyncSafeResult} from '@type/common';
import {AdminData, AdminResult} from './interfaces';
import AdminModel from '@/database/models/admin';
import bcrypt from 'bcrypt';
import {DuplicateUserError, NotFoundError, PermissionError} from '../errors';
import UserModel, {UserDB} from '@/database/models/user';
import {Document} from 'mongoose';

interface AdminService {
  addProduct(data: ProductData): AsyncSafeResult<ProductResult>;
  removeProduct(id: string): void;
  editProduct(id: string, data: Partial<ProductData>): AsyncSafeResult<ProductData>;

  banUser(id: string): void;
  unBanUser(id: string): void;
}

export class Admin implements AdminService {
  constructor(protected _id: string, protected _role: string) {}
  async addProduct(data: ProductData): AsyncSafeResult<ProductResult> {
    try {
      return await createProduct(data, this._id);
    } catch (err) {
      return {error: err, result: null};
    }
  }
  // TODO: Admin Services
  async editProduct(_: string, __: Partial<ProductData>): AsyncSafeResult<ProductData> {
    try {
      throw new Error('not implemented');
    } catch (err) {
      return {error: err, result: null};
    }
  }

  async getAllUsers(): AsyncSafeResult<Document<UserDB>[]> {
    try {
      const users = await UserModel.find({});
      return {result: users, error: null};
    } catch (err) {
      return {error: err, result: null};
    }
  }

  async getOneUser(id: string): AsyncSafeResult<Document<UserDB>> {
    try {
      const user = await UserModel.findById({_id: id});
      if (!user) {
        throw new NotFoundError('User With id ' + id);
      }
      return {result: user, error: null};
    } catch (err) {
      return {error: err, result: null};
    }
  }

  async removeProduct(id: string): Promise<Error | null> {
    return removeProduct(id);
  }

  async getAllProducts(): AsyncSafeResult<ProductItemApi[]> {
    try {
      const products = await getProductsList();
      return products;
    } catch (err) {
      return { error: err, result: null };
    }
  }

  banUser(_: string): void {}

  unBanUser(_: string): void {}
}

interface SuperAdminService {
  // TODO: Change Types
  createAdmin(adminData: AdminData): AsyncSafeResult<AdminResult>;
  removeAdmin(id: string): void;
  getAdminsList(role: string): AsyncSafeResult<AdminResult[]>;
}

export class SuperAdmin extends Admin implements SuperAdminService {
  constructor(id: string, role: string) {
    super(id, role);
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
      return {error: null, result};
    } catch (err) {
      if (err.code === 11000) {
        err = new DuplicateUserError('Admin already exists');
      }
      return {error: err, result: null};
    }
  }

  async removeAdmin(id: string): Promise<Error | null> {
    try {
      const adminDB = await AdminModel.findById(id);
      if (!adminDB) throw new Error('');

      if (this._id === adminDB._id.toString()) {
        return new PermissionError();
      }

      if (this._role === 'superadmin' && ['superadmin', 'manager'].includes(adminDB.role)) {
        return new PermissionError();
      }

      await AdminModel.deleteOne({_id: id});
      return null;
    } catch (err) {
      return err;
    }
  }
  async getAdminsList(role: string): AsyncSafeResult<AdminResult[]> {
    try {
      let query: {role?: string} = {};
      if (role === 'admin') query.role = 'admin';
      if (role === 'super') query.role = 'superadmin';
      let adminsList = await AdminModel.find({$and: [query, {role: {$ne: 'manager'}}]});
      const result: AdminResult[] = adminsList.map(a => ({
        createdAt: a.createdAt,
        id: a._id.toString(),
        name: a.name,
        role: a.role,
      }));
      return {result, error: null};
    } catch (err) {
      return {error: err, result: null};
    }
  }
}
