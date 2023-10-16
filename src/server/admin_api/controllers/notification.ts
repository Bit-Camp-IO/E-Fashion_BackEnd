import { Controller, Guard, Validate } from '@server/decorator';
import { notificationMessageSchema } from '../valid';
import { HttpStatus } from '@server/utils/status';
import { Request, Response } from 'express';
import { AdminRole } from '@/core/admin';
import { Admin } from '@/core/admin/admin';

@Controller()
class NotificationController {
  @Validate(notificationMessageSchema)
  @Guard(AdminRole.ADMIN)
  public async push(req: Request, res: Response) {
    const body = req.body;
    const admin = req.admin as Admin;
    admin.pushNotification(body);
    res.JSON(HttpStatus.Ok);
  }
}

export default new NotificationController();
