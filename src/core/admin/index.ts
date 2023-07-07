import bcrypt from 'bcrypt';
import AdminModel from '@/database/models/admin';
import { AsyncSafeResult, SafeResult } from '@type/common';
import { createToken } from '../auth/token';
import Config from '@/config';
import Manager from './manager';
import { Admin, SuperAdmin } from './admin';
import { InvalidCredentialsError, UnauthorizedError } from '../errors';

interface AdminLogin {
  email: string;
  password: string;
}

interface TokenResult {
  token: string;
}

export async function login(adminData: AdminLogin): Promise<SafeResult<TokenResult>> {
  try {
    const { email, password } = adminData;
    const admin = await AdminModel.findOne({ email }).select('+password').exec();
    if (!admin) {
      throw new InvalidCredentialsError();
    }

    const validPass = await bcrypt.compare(password, admin.password);
    if (!validPass) {
      throw new InvalidCredentialsError();
    }

    const accessToken = createToken(
      { id: admin.id },
      Config.ACCESS_TOKEN_PRIVATE_KEY,
      Config.ACCESS_TOKEN_EXP,
    );
    return { result: { token: accessToken }, error: null };
  } catch (err) {
    return { error: err, result: null };
  }
}

export enum AdminRole {
  ADMIN = 'admin',
  SUPER_ADMIN = 'superAdmin',
  MANAGER = 'manager',
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

export async function getAdminServices(id: string, role: AdminRole) {
  try {
    const adminDB = await AdminModel.findById(id);
    if (!adminDB) {
      throw new UnauthorizedError();
    }
    if (role === AdminRole.ADMIN) {
      return { result: new Admin(adminDB._id.toString()), error: null };
    }
    if (role === AdminRole.SUPER_ADMIN && ['superAdmin', 'manager'].includes(adminDB.role)) {
      return { result: new SuperAdmin(adminDB._id.toString()), error: null };
    }
    if (role === AdminRole.MANAGER && adminDB.role === 'manager') {
      return { result: new Manager(adminDB.id.toString()), error: null };
    }
    // Throw new Error Unauth
    throw new UnauthorizedError();
  } catch (err) {
    return {
      error: new Error(),
      result: null,
    };
  }
}
