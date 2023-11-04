import { Controller, Validate } from '@server/decorator';
import { Request, Response } from 'express';
import { AdminBody, adminSchema } from '../valid';
import { createManager } from '@/core/admin/manager';
import { handleResultError, unwrapResult } from '@server/utils/errors';
import { HttpStatus } from '@server/utils/status';
import { AdminRole, getAdminServices } from '@/core/admin';

@Controller()
class ManagerController {
  @Validate(adminSchema)
  async create(req: Request, res: Response) {
    const body: AdminBody = req.body;
    const manager = await createManager({
      email: body.email,
      name: body.name,
      password: body.password,
      phone: body.phone,
    });
    // if (manager.error) {
    //   if (manager.error instanceof ManagerExistError) {
    //     throw new RequestError(manager.error.message, HttpStatus.BadRequest);
    //   }
    //   throw RequestError._500();
    // }
    unwrapResult(manager);
    res.JSON(HttpStatus.Created, manager.result);
  }

  @Validate(adminSchema)
  async createSuper(req: Request, res: Response) {
    const body: AdminBody = req.body;
    const { result: manager, error } = await getAdminServices(req.userId!, AdminRole.MANAGER);
    // if (error) {
    //   if (error instanceof UnauthorizedError) {
    //     throw new RequestError(error.message, HttpStatus.Unauthorized);
    //   }
    //   throw RequestError._500();
    // }
    if (error) {
      handleResultError(error);
    }
    const superAdmin = await manager.createSuperAdmin({
      email: body.email,
      name: body.name,
      password: body.password,
      phone: body.phone,
    });
    // if (superAdmin.error) {
    //   if (superAdmin.error instanceof DuplicateError) {
    //     throw new RequestError(superAdmin.error.message, HttpStatus.BadRequest);
    //   }
    //   throw RequestError._500();
    // }
    const result = unwrapResult(superAdmin);
    res.JSON(HttpStatus.Created, result);
  }
}

export default new ManagerController();
