import bcrypt from 'bcrypt';
import AdminModel from '@/database/models/admin';
import {AsyncSafeResult} from '@type/common';
import {createToken} from '../auth/token';
import Config from '@/config';
import Manager from './manager';
import {Admin, SuperAdmin} from './admin';
import {InvalidCredentialsError, UnauthorizedError} from '../errors';

interface AdminLogin {
  email: string;
  password: string;
}

interface TokenResult {
  token: string;
}

export async function login(adminData: AdminLogin): AsyncSafeResult<TokenResult> {
  try {
    const {email, password} = adminData;
    const admin = await AdminModel.findOne({email}).select('+password').exec();
    if (!admin) {
      throw new InvalidCredentialsError();
    }

    const validPass = await bcrypt.compare(password, admin.password);
    if (!validPass) {
      throw new InvalidCredentialsError();
    }

    const accessToken = createToken({id: admin.id}, Config.ACCESS_TOKEN_PRIVATE_KEY, '30d');
    return {result: {token: accessToken}, error: null};
  } catch (err) {
    return {error: err, result: null};
  }
}

export enum AdminRole {
  ADMIN = 'admin',
  SUPER_ADMIN = 'superadmin',
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

export async function getAdminServices(id: string, role: AdminRole): AsyncSafeResult<Admin>;

export async function getAdminServices(id: string, role: AdminRole) {
  try {
    const adminDB = await AdminModel.findById(id);
    if (!adminDB) {
      throw new UnauthorizedError();
    }
    if (role === AdminRole.ADMIN) {
      return {result: new Admin(adminDB._id.toString(), adminDB.role), error: null};
    }
    if (role === AdminRole.SUPER_ADMIN && ['superadmin', 'manager'].includes(adminDB.role)) {
      return {result: new SuperAdmin(adminDB._id.toString(), adminDB.role), error: null};
    }
    if (role === AdminRole.MANAGER && adminDB.role === 'manager') {
      return {result: new Manager(adminDB.id.toString(), adminDB.role), error: null};
    }
    // Throw new Error Unauth
    throw new UnauthorizedError();
  } catch (err) {
    return {error: err, result: null};
  }
}
