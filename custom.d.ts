import {Admin, SuperAdmin} from '@/core/admin/admin';
import Manager from '@/core/admin/manager';

export {};

declare global {
  namespace Express {
    export interface Request {
      userId?: string;
      admin?: Admin | SuperAdmin | Manager;
    }
  }
}
