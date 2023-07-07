import { Controller, Validate } from '@server/decorator';
import { Request, Response } from 'express';
import { AdminBody, adminSchema } from '../valid';
import { createManager } from '@/core/admin/manager';
import RequestError from '@server/utils/errors';
import { HttpStatus } from '@server/utils/status';
import { wrappResponse } from '@server/utils/response';
import { ManagerExistError } from '@/core/errors';

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
    if (manager.error) {
      if (manager.error instanceof ManagerExistError) {
        throw new RequestError(manager.error.message, HttpStatus.BadRequest);
      }
      throw RequestError._500();
    }
    res.status(HttpStatus.Created).json(wrappResponse(manager.result, HttpStatus.Created));
  }
}

export default new ManagerController();
