import { Controller, Guard, Validate } from '@server/decorator';
import RequestError from '@server/utils/errors';
import { HttpStatus } from '@server/utils/status';
import { Request, Response } from 'express';
import { AdminRole } from '@/core/admin';
import { NotFoundError } from '@/core/errors';
import { Admin } from '@/core/admin/admin';
import { orderStatusSchema } from '../valid';
import { validateId } from '@/core/utils';

@Controller()
class OrderController {
  @Guard(AdminRole.ADMIN)
  @Validate(orderStatusSchema)
  public async changeOrderStatus(req: Request, res: Response) {
    if (!validateId(req.params['id']))
      throw new RequestError('Invalid Order Id', HttpStatus.BadRequest);
    const admin = req.admin as Admin;
    const order = await admin.chnageOrderStatus(req.params['id'], req.body.status);
    if (order.error) {
      console.log(order.error);
      if (order.error instanceof NotFoundError) {
        throw new RequestError(order.error.message, HttpStatus.BadRequest);
      }
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Ok, order.result);
  }
}

export default new OrderController();
