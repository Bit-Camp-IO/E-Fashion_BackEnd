import * as fs from 'fs';
import { join } from 'node:path';

const Config = {
  PORT: process.env['PORT']!,
  MONGODB_URI: process.env['MONGODB_URI']!,
  ACCESS_TOKEN_PRIVATE_KEY: fs.readFileSync(process.env['ACCESS_TOKEN_PRIVATE_KEY']!, 'utf-8'),
  ACCESS_TOKEN_PUBLIC_KEY: fs.readFileSync(process.env['ACCESS_TOKEN_PUBLIC_KEY']!, 'utf-8'),
  REFRESH_TOKEN_PRIVATE_KEY: fs.readFileSync(process.env['REFRESH_TOKEN_PRIVATE_KEY']!, 'utf-8'),
  REFRESH_TOKEN_PUBLIC_KEY: fs.readFileSync(process.env['REFRESH_TOKEN_PUBLIC_KEY']!, 'utf-8'),
  REFRESH_TOKEN_EXP: process.env['REFRESH_TOKEN_EXP']!,
  ACCESS_TOKEN_EXP: process.env['ACCESS_TOKEN_EXP']!,
  GOOGLE_ID: process.env['GOOGLE_CLIENT_ID']!,
  GOOGLE_SECRET: process.env['GOOGLE_CLIENT_SECRET']!,
  GOOGLE_REDIRECT: 'http://localhost:8080/api/auth/google/redirect',
  ProfileImagesDir: join(__dirname, '..', '..', 'uploads', 'profile'),
  CatImagesDir: join(__dirname, '..', '..', 'uploads', 'category'),
  ProductImagesDir: join(__dirname, '..', '..', 'uploads', 'product'),
  ENCRYPTION_KEY: process.env['ENCRYPTION_KEY']!,
  STRIPE_PUBLIC_KEY: process.env['STRIPE_PUBLIC_KEY']!,
  STRIPE_PRIVATE_KEY: process.env['STRIPE_PRIVATE_KEY']!,
  STRIPE_ENDPOINT_SECRET: process.env['STRIPE_ENDPOINT_SECRET']!,
  EMAIL_SENDER: process.env['EMAIL_SENDER']!,
  EMAIL_SENDER_PASSWORD: process.env['EMAIL_SENDER_PASSWORD']!,
  NODE_ENV: process.env['NODE_ENV']!,
  Default_Notification: false, // Change this if you want to customize notification
};
export default Config;
