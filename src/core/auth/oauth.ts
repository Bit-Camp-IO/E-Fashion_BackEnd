import QueryString from 'qs';
import axios from 'axios';
import Config from '@/config';
import jwt from 'jsonwebtoken';
import UserModel from '@/database/models/user';
import { AuthResponse } from './jwt';
import { AsyncSafeResult } from '@type/common';
import { createToken } from './token';
import { UnauthorizedGoogleError } from '../errors';

interface GooglePayload {
  email: string;
  name: string;
}

export class OAuthAuthService {
  static loginGooglePageUrl(): string {
    const rootUrl = 'https://accounts.google.com/o/oauth2/auth';
    const options = {
      redirect_uri: Config.GOOGLE_REDIRECT,
      client_id: Config.GOOGLE_ID,
      access_type: 'offline',
      response_type: 'code',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ].join(' '),
    };
    const searchPrams = QueryString.stringify(options);
    return `${rootUrl}?${searchPrams}`;
  }

  static async handleGoogleCode(code: string): AsyncSafeResult<AuthResponse> {
    try {
      const url = 'https://oauth2.googleapis.com/token';
      const body = {
        code,
        client_id: Config.GOOGLE_ID,
        client_secret: Config.GOOGLE_SECRET,
        redirect_uri: Config.GOOGLE_REDIRECT,
        grant_type: 'authorization_code',
      };
      const response = await axios.post(url, body);
      const userData = jwt.decode(response.data.id_token) as GooglePayload;
      let user = await UserModel.findOne({ email: userData.email });
      if (!user) {
        user = await UserModel.create({
          email: userData.email,
          fullName: userData.name,
          provider: 'GOOGLE',
        });
      }
      const accessToken = createToken({ id: user._id }, Config.ACCESS_TOKEN_PRIVATE_KEY, '600s');
      const refreshToken = createToken(
        { id: user._id },
        Config.REFRESH_TOKEN_PRIVATE_KEY,
        Config.REFRESH_TOKEN_EXP,
      );
      const result = {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        accessToken,
        refreshToken,
      };
      return { result, error: null };
    } catch {
      return { result: null, error: new UnauthorizedGoogleError() };
    }
  }
}
