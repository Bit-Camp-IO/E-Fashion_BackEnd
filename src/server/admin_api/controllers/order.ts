import { Controller, Guard, Validate } from '@server/decorator';
import RequestError from '@server/utils/errors';
import { HttpStatus } from '@server/utils/status';
import { Request, Response } from 'express';
import { AdminRole } from '@/core/admin';
import { NotFoundError } from '@/core/errors';
import { Admin } from '@/core/admin/admin';
import { orderStatusSchema } from '../valid';
import { validateId } from '@/core/utils';
import Notification, { NotificationType } from '@/core/notification';

@Controller()
class OrderController {
  @Guard(AdminRole.ADMIN)
  @Validate(orderStatusSchema)
  public async changeOrderStatus(req: Request, res: Response) {
    if (!validateId(req.params['id']))
      throw new RequestError('Invalid Order Id', HttpStatus.BadRequest);
    const admin = req.admin as Admin;
    const order = await admin.changeOrderStatus(req.params['id'], req.body.status);
    if (order.error) {
      if (order.error instanceof NotFoundError) {
        throw new RequestError(order.error.message, HttpStatus.BadRequest);
      }
      throw RequestError._500();
    }
    const noti = new Notification(NotificationType.STATUS_ORDER, order.result.user);
    await noti.push({
      title: `Order ${order.result.status}`,
      body: `Order Id ${order.result._id} now ${order.result.status}`,
    });
    res.JSON(HttpStatus.Ok, order.result);
  }
}

export default new OrderController();
