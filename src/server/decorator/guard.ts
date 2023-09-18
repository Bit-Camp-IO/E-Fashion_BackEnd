import { AdminRole, getAdminServices } from '@/core/admin';
import { UnauthorizedError } from '@/core/errors';
import RequestError from '@server/utils/errors';
import { HttpStatus } from '@server/utils/status';

export const Guard = (role: AdminRole) => {
  return (_: any, __: string, descriptor: PropertyDescriptor) => {
    const fn = descriptor.value;
    descriptor.value = async (...args: any) => {
      const [req] = args;
      console.log(req.userId);
      const admin = await getAdminServices(req.userId, role);
      console.log(admin);
      if (admin.error) {
        if (admin.error instanceof UnauthorizedError) {
          throw new RequestError(admin.error.message, HttpStatus.Unauthorized);
        }
        throw RequestError._500();
      }
      req.admin = admin.result;
      return fn.apply(this, args);
    };
    return descriptor;
  };
};
