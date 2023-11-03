import bcrypt from 'bcrypt';
import AdminModel from '@/database/models/admin';
import { AsyncSafeResult } from '../types';
import { createToken } from '../auth/token';
import Config from '@/config';
import Manager from './manager';
import { Admin, SuperAdmin } from './admin';
import { AppError } from '../errors';
import { AdminLogin, AdminRole, TokenResult } from './interfaces';

export * from './interfaces';

export async function login(adminData: AdminLogin): AsyncSafeResult<TokenResult> {
  try {
    const { email, password } = adminData;
    const admin = await AdminModel.findOne({ email }).select('+password').exec();
    if (!admin) {
      throw AppError.invalidCredentials();
    }

    const validPass = await bcrypt.compare(password, admin.password);
    if (!validPass) {
      throw AppError.invalidCredentials();
    }

    const accessToken = createToken({ id: admin.id }, Config.ACCESS_TOKEN_PRIVATE_KEY, '30d');
    return { result: { token: accessToken }, error: null };
  } catch (err) {
    return { error: err, result: null };
  }
}

export async function getAdminServices(id: string, role: AdminRole.ADMIN): AsyncSafeResult<Admin>;
export async function getAdminServices(
  id: string,
  role: AdminRole.SUPER_ADMIN,
): AsyncSafeResult<SuperAdmin>;
export async function getAdminServices(
  id: string,
  role: AdminRole.MANAGER,
): AsyncSafeResult<Manager>;
export async function getAdminServices(id: string, role: AdminRole): AsyncSafeResult<Admin>;
export async function getAdminServices(id: string, role: AdminRole) {
  try {
    const adminDB = await AdminModel.findById(id);
    if (!adminDB) {
      throw AppError.unauthorized();
    }
    if (role === AdminRole.ADMIN) {
      return { result: new Admin(adminDB._id.toString(), adminDB.role), error: null };
    }
    if (role === AdminRole.SUPER_ADMIN && ['superadmin', 'manager'].includes(adminDB.role)) {
      return { result: new SuperAdmin(adminDB._id.toString(), adminDB.role), error: null };
    }
    if (role === AdminRole.MANAGER && adminDB.role === 'manager') {
      return { result: new Manager(adminDB.id.toString(), adminDB.role), error: null };
    }
    throw AppError.unauthorized();
  } catch (err) {
    return { error: err, result: null };
  }
}
