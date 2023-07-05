import bcrypt from 'bcrypt';
import AdminModel from '@/database/models/admin';
import { SafeResult } from '@type/common';
import { createToken } from '../auth/token';
import Config from '@/config';

interface AdminLogin {
  email: string;
  password: string;
}

interface TokenResult {
  token: string;
}

class AdminServices {
  static async login(adminData: AdminLogin): Promise<SafeResult<TokenResult>> {
    try {
      const { email, password } = adminData;
      const admin = await AdminModel.findOne({ email }).select('+password').exec();
      if (!admin) {
        // TODO: ERROR
        throw new Error('');
      }
      const validPass = await bcrypt.compare(password, admin.password);
      if (!validPass) {
        // TODO: ERROR
        throw new Error('');
      }
      const accessToken = createToken(
        { id: admin.id },
        Config.ACCESS_TOKEN_PRIVATE_KEY,
        Config.ACCESS_TOKEN_EXP,
      );
      return {
        result: {
          token: accessToken,
        },
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

export default AdminServices;
