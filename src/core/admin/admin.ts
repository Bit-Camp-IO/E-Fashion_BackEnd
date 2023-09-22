import * as Product from '../product';
import { ProductData, ProductResponse } from '../product/interfaces';
import { AsyncSafeResult } from '@type/common';
import { AdminData, AdminResult } from './interfaces';
import AdminModel from '@/database/models/admin';
import bcrypt from 'bcrypt';
import { DuplicateError, NotFoundError, PermissionError } from '../errors';
import UserModel, { UserDB } from '@/database/models/user';
import { Document } from 'mongoose';
import { CategoryData, CategoryResult } from '../category/interfaces';
import * as Category from '../category';
import { BrandData, BrandResult } from '../brand/interfaces';
import {
  addProductsToBrand,
  createBrand,
  removeBrand,
  updateBrand,
  removeProductsFromBrand,
} from '../brand';
import { addDiscount, removeDiscount } from '../product';
import collection, { CollectionInput, CollectionResult, EditCollectionInput } from '../collection';
interface AdminService {
  addProduct(data: ProductData): AsyncSafeResult<ProductResponse>;
  removeProduct(id: string): void;
  editProduct(id: string, data: Partial<ProductData>): AsyncSafeResult<ProductData>;

  banUser(id: string): void;
  unBanUser(id: string): void;
}

export class Admin implements AdminService {
  constructor(protected _id: string, protected _role: string) {}
  async addProduct(data: ProductData): AsyncSafeResult<ProductResponse> {
    return await Product.createProduct(data, this._id);
  }

  async editProduct(id: string, productData: Partial<ProductData>): AsyncSafeResult<ProductData> {
    return await Product.updateProduct(id, productData);
  }

  async getAllUsers(): AsyncSafeResult<Document<UserDB>[]> {
    try {
      const users = await UserModel.find({});
      return { result: users, error: null };
    } catch (err) {
      return { error: err, result: null };
    }
  }

  async getOneUser(id: string): AsyncSafeResult<Document<UserDB>> {
    try {
      const user = await UserModel.findById({ _id: id });
      if (!user) {
        throw new NotFoundError('User With id ' + id);
      }
      return { result: user, error: null };
    } catch (err) {
      return { error: err, result: null };
    }
  }

  async removeProduct(id: string): Promise<Error | null> {
    return Product.removeProduct(id);
  }

  async addCategory(data: CategoryData): AsyncSafeResult<CategoryResult> {
    return Category.createCategory(data, this._id);
  }

  async addProductsToCategory(catId: string, proIds: string[]): AsyncSafeResult<CategoryResult> {
    return Category.AddProductToCategory(catId, proIds);
  }

  async removeProductsFromCategory(catId: string, proIds: string[]): Promise<Error | null> {
    return Category.removeProductFromCategory(catId, proIds);
  }

  async editCategory(data: Partial<CategoryData>, id: string): AsyncSafeResult<CategoryResult> {
    return Category.updateCategory(id, data);
  }

  async removeCategory(id: string): Promise<Error | null> {
    return Category.removeCategory(id);
  }

  async banUser(id: string): Promise<Error | null> {
    try {
      const user = await UserModel.findById({ _id: id });
      if (!user) {
        throw new NotFoundError('User With id ' + id);
      }
      if (user.banned) {
        throw new Error('User is already banned');
      }
      user.banned = true;
      await user.save();
      return null;
    } catch (err) {
      return err;
    }
  }

  async unBanUser(id: string): Promise<Error | null> {
    try {
      const user = await UserModel.findById({ _id: id });
      if (!user) {
        throw new NotFoundError('User With id ' + id);
      }
      if (!user.banned) {
        throw new Error('User is not banned');
      }
      user.banned = false;
      await user.save();
      return null;
    } catch (err) {
      return err;
    }
  }

  async addBrand(data: BrandData): AsyncSafeResult<BrandResult> {
    return createBrand(data);
  }

  async editBrand(data: Partial<BrandData>, id: string): AsyncSafeResult<BrandResult> {
    return updateBrand(id, data);
  }

  async removeBrand(id: string): Promise<Error | null> {
    return removeBrand(id);
  }

  async addProductsToBrand(brandId: string, prodIds: string[]): AsyncSafeResult<BrandResult> {
    return addProductsToBrand(brandId, prodIds);
  }

  async removeProductsFromBrand(brandId: string, prodIds: string[]): Promise<Error | null> {
    return removeProductsFromBrand(brandId, prodIds);
  }

  async addDiscount(productId: string, discount: number): AsyncSafeResult<ProductResponse> {
    return addDiscount(productId, discount);
  }

  async removeDiscount(productId: string): Promise<Error | null> {
    return removeDiscount(productId);
  }

  async createCollection(collectionData: CollectionInput): AsyncSafeResult<CollectionResult> {
    return collection.create(collectionData);
  }

  async editCollection(
    collectionId: string,
    collectionData: EditCollectionInput,
  ): AsyncSafeResult<CollectionResult> {
    return collection.edit(collectionId, collectionData);
  }
  async removeCollection(collectionId: string): Promise<Error | null> {
    return collection.remove(collectionId);
  }
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
      return { error: null, result };
    } catch (err) {
      if (err.code === 11000) {
        err = new DuplicateError('Admin');
      }
      return { error: err, result: null };
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

      await AdminModel.deleteOne({ _id: id });
      return null;
    } catch (err) {
      return err;
    }
  }
  async getAdminsList(role: string): AsyncSafeResult<AdminResult[]> {
    try {
      let query: { role?: string } = {};
      if (role === 'admin') query.role = 'admin';
      if (role === 'super') query.role = 'superadmin';
      let adminsList = await AdminModel.find({ $and: [query, { role: { $ne: 'manager' } }] });
      const result: AdminResult[] = adminsList.map(a => ({
        createdAt: a.createdAt,
        id: a._id.toString(),
        name: a.name,
        role: a.role,
      }));
      return { result, error: null };
    } catch (err) {
      return { error: err, result: null };
    }
  }
}
