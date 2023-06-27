import UserModel from '@/database/models/user';
import bcrypt from 'bcrypt';
import { createToken } from './token';
import Config from '@/config';

interface UserRegistrationData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

interface RegisterResponse {
  email: string;
  fullName: string;
  id: string;
  accessToken: string;
  refreshToken: string;
}

interface UserLogin {
  email: string;
  password: string;
}

class AuthService {
  static async register(userData: UserRegistrationData): Promise<RegisterResponse> {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      let user = await new UserModel({
        email: userData.email,
        password: hashedPassword,
        phoneNumber: userData.phone,
        fullName: userData.fullName,
        provider: 'LOCAL',
      }).save();
      const accessToken = createToken({ id: user._id }, Config.ACCESS_TOKEN_PRIVATE_KEY, '600s');
      const refreshToken = createToken({ id: user._id }, Config.REFRESH_TOKEN_PRIVATE_KEY, '20d');
      return {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        accessToken,
        refreshToken,
      };
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async login(userData: UserLogin): Promise<{ access_token: string }> {
    try {
      const { email, password } = userData;

      const user  = await UserModel.findOne({ email }).exec();

      if (!user) {
        throw new Error('Invalid credintials');
      }

      const validPass = await bcrypt.compare(password, user.password);

      if (validPass) {
        const token = createToken({ id: user.id }, Config.ACCESS_TOKEN_PRIVATE_KEY, '600s');
        return { access_token: token, };
      } else {
        throw new Error('Invalid credintials');
      }
    } catch (err) {
      throw new Error(err.message)
    }
  }
}

export default AuthService;
