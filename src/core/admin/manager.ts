import AdminModel from '@/database/models/admin';
import { ManagerExistError } from './errors';
import { SafeResult } from '@type/common';
import { AdminResult } from './interfaces';
import bcrypt from 'bcrypt';
interface ManagerCreationData {
  name: string;
  email: string;
  password: string;
  phone: string;
  address?: string;
}

class Manager {
  private constructor() {}
  static async managerExist(): Promise<boolean> {
    const managerExist = await AdminModel.findOne({ role: 'manager' }).select({ _id: 1 });
    return !!managerExist;
  }
  static async createManager(managerData: ManagerCreationData): Promise<SafeResult<AdminResult>> {
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
      return {
        result,
        error: null,
      };
    } catch (err) {
      return {
        error: err,
        result: null,
      };
    }
  }
}

export default Manager;
