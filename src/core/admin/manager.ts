import AdminModel from '@/database/models/admin';
import { AppError, ErrorType } from '../errors';
import { AsyncSafeResult } from '../types';
import { AdminData, AdminResult } from './interfaces';
import bcrypt from 'bcrypt';
import { SuperAdmin } from './admin';

class Manager extends SuperAdmin {
  constructor(id: string, role: string) {
    super(id, role);
  }

  static async managerExist(): Promise<boolean> {
    const managerExist = await AdminModel.findOne({ role: 'manager' }).select({ _id: 1 });
    return !!managerExist;
  }

  public async createSuperAdmin(adminData: AdminData): AsyncSafeResult<AdminResult> {
    try {
      const hashedPassword = await bcrypt.hash(adminData.password, 12);

      const superAdmin = await AdminModel.create({
        ...adminData,
        password: hashedPassword,
        role: 'superadmin',
        addedBy: this._id,
      });

      const result: AdminResult = {
        createdAt: superAdmin.createdAt,
        id: superAdmin._id.toString(),
        name: superAdmin.name,
        role: superAdmin.role,
      };

      return { result, error: null };
    } catch (err) {
      if (err.code === 11000) {
        err = new AppError(ErrorType.Duplicate, 'Super admin already registered.');
      }
      return { error: err, result: null };
    }
  }
}

export async function createManager(managerData: AdminData): AsyncSafeResult<AdminResult> {
  try {
    const managerExist = await Manager.managerExist();
    if (managerExist) {
      throw new AppError(ErrorType.ManagerExist, 'Manager already assigned to this project role.');
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
