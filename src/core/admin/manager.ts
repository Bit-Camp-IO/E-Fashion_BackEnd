import AdminModel from '@/database/models/admin';
import { ManagerExistError, UnauthorizedError } from '../errors';
import { AsyncSafeResult } from '@type/common';
import { AdminData, AdminResult } from './interfaces';
import bcrypt from 'bcrypt';
import { SuperAdmin } from './admin';

class Manager extends SuperAdmin {
  constructor(id: string) {
    super(id);
  }

  static async managerExist(): Promise<boolean> {
    const managerExist = await AdminModel.findOne({ role: 'manager' }).select({ _id: 1 });
    return !!managerExist;
  }

static async createSuper(adminData: AdminData, addedById: string): Promise<AsyncSafeResult<AdminResult>> {
  try {
    const addedBy = await AdminModel.findOne({ _id: addedById }).exec();
    if (addedBy) {
      if (addedBy.role !== 'manager')
        throw new UnauthorizedError();

      const hashedPassword = await bcrypt.hash(adminData.password, 12);
      const superAdmin = await AdminModel.create({
        ...adminData,
        password: hashedPassword,
        role: 'superadmin',
        addedBy: addedBy._id,
      });

      const result: AdminResult = {
        createdAt: superAdmin.createdAt,
        id: superAdmin._id.toString(),
        name: superAdmin.name,
        role: superAdmin.role,
      };

      return { result, error: null };
    } else {
      throw new UnauthorizedError();
    }
  } catch (err) {
    return { error: err, result: null };
  }
}
}

export async function createManager(managerData: AdminData): AsyncSafeResult<AdminResult> {
  try {
    const managerExist = await Manager.managerExist();
    if (managerExist) {
      throw new ManagerExistError();
    }
    const hashedPassword = await bcrypt.hash(managerData.password, 12);
    const manager = await AdminModel.create({
      ...managerData,
      password: hashedPassword,
      role: 'manager',
    });
    const result: AdminResult = {
      createdAt: manager.createdAt,
      id: manager._id.toString(),
      name: manager.name,
      role: manager.role,
    };
    return { result, error: null };
  } catch (err) {
    return { error: err, result: null };
  }
}

export default Manager;
