import { Controller, Guard, Validate } from '@server/decorator';
import RequestError, { unwrapResult } from '@server/utils/errors';
import { HttpStatus } from '@server/utils/status';
import { Request, Response } from 'express';
import { AdminRole } from '@/core/admin';
import { Admin } from '@/core/admin/admin';
import { orderStatusSchema } from '../valid';
import { validateId } from '@/core/utils';
import Notification, { NotificationType } from '@/core/notification';
import { OrderStatus } from '@/core/order';

@Controller()
class OrderController {
  @Guard(AdminRole.ADMIN)
  @Validate(orderStatusSchema)
  public async changeOrderStatus(req: Request, res: Response) {
    if (!validateId(req.params['id']))
      throw new RequestError('Invalid Order Id', HttpStatus.BadRequest);
    const admin = req.admin as Admin;
    const order = await admin.changeOrderStatus(req.params['id'], req.body.status);
    // if (order.error) {
    //   if (order.error instanceof NotFoundError) {
    //     throw new RequestError(order.error.message, HttpStatus.BadRequest);
    //   }
    //   throw RequestError._500();
    // }
    const result = unwrapResult(order);
    const notification = new Notification(NotificationType.STATUS_ORDER, result.user);
    await notification.push({
      title: `Order #${result._id?.toString().slice(0, 4)}`,
      body: _formatNotificationBody(result.status),
    });
    res.JSON(HttpStatus.Ok, result);
  }
}

export default new OrderController();

function _formatNotificationBody(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.PROGRESS:
      return `Your order is being processed`;
    case OrderStatus.WAY:
      return `Your order is on it's way`;
    case OrderStatus.DELIVERED:
      return `Your order has been delivered`;
    default:
      return '';
  }
}
