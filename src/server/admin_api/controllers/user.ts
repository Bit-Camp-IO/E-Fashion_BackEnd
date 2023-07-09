import {Controller} from '@server/decorator';
import RequestError from '@server/utils/errors';
import {wrappResponse} from '@server/utils/response';
import {HttpStatus} from '@server/utils/status';
import {Request, Response} from 'express';
import {AdminRole, getAdminServices} from '@/core/admin';
import {NotFoundError, UnauthorizedError} from '@/core/errors';

@Controller()
class AdminController {
  public async getAllUsers(req: Request, res: Response) {
    const {result: admin, error} = await getAdminServices(req.userId!, AdminRole.ADMIN);
    if (error) {
      if (error instanceof UnauthorizedError) {
        throw new RequestError(error.message, HttpStatus.Unauthorized);
      }
      throw RequestError._500();
    }
    const users = await admin.getAllUsers();
    if (users.error) throw RequestError._500();
    res.status(HttpStatus.Ok).json(wrappResponse(users.result, HttpStatus.Ok));
  }

  public async getOneUser(req: Request, res: Response) {
    const {id} = req.params;
    const {result: admin, error} = await getAdminServices(req.userId!, AdminRole.ADMIN);
    if (error) {
      if (error instanceof UnauthorizedError) {
        throw new RequestError(error.message, HttpStatus.Unauthorized);
      }
      throw RequestError._500();
    }
    const user = await admin.getOneUser(id);
    if (user.error) {
      if (user.error instanceof NotFoundError)
        throw new RequestError(user.error.message, HttpStatus.NotFound);
    }
    res.status(HttpStatus.Ok).json(wrappResponse(user.result, HttpStatus.Ok));
  }
}

export default new AdminController();
