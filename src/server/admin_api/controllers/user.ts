import { Controller, Guard } from '@server/decorator';
import { handleResultError, unwrapResult } from '@server/utils/errors';
import { HttpStatus } from '@server/utils/status';
import { Request, Response } from 'express';
import { AdminRole, getAdminServices } from '@/core/admin';
// import { NotFoundError, UnauthorizedError } from '@/core/errors';
import { Admin } from '@/core/admin/admin';

@Controller()
class AdminController {
  @Guard(AdminRole.ADMIN)
  public async getAllUsers(req: Request, res: Response) {
    const admin = req.admin as Admin;
    const users = await admin.getAllUsers();
    unwrapResult(users);
    // if (users.error) throw RequestError._500();
    res.JSON(HttpStatus.Ok, users.result);
  }

  public async getOneUser(req: Request, res: Response) {
    const { id } = req.params;
    const { result: admin, error } = await getAdminServices(req.userId!, AdminRole.ADMIN);
    // if (error) {
    //   if (error instanceof UnauthorizedError) {
    //     throw new RequestError(error.message, HttpStatus.Unauthorized);
    //   }
    //   throw RequestError._500();
    // }
    if (error) {
      handleResultError(error);
    }
    const user = await admin.getOneUser(id);
    // if (user.error) {
    //   if (user.error instanceof NotFoundError)
    //     throw new RequestError(user.error.message, HttpStatus.NotFound);
    // }
    unwrapResult(user);
    res.JSON(HttpStatus.Ok, user.result);
  }
}

export default new AdminController();
