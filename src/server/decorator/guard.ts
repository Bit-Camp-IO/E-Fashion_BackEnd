import { AdminRole, getAdminServices } from '@/core/admin';
import { unwrapResult } from '@server/utils/errors';

export const Guard = (role: AdminRole) => {
  return (_: any, __: string, descriptor: PropertyDescriptor) => {
    const fn = descriptor.value;
    descriptor.value = async (...args: any) => {
      const [req] = args;
      const admin = await getAdminServices(req.userId, role);
      // if (admin.error) {
      //   if (admin.error instanceof UnauthorizedError) {
      //     throw new RequestError(admin.error.message, HttpStatus.Unauthorized);
      //   }
      //   throw RequestError._500();
      // }
      unwrapResult(admin);
      req.admin = admin.result;
      return fn.apply(this, args);
    };
    return descriptor;
  };
};
