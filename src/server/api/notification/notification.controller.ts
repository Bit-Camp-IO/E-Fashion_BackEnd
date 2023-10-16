import { Controller, Validate } from '@server/decorator';
import RequestError from '@server/utils/errors';
import { HttpStatus } from '@server/utils/status';
import { Request, Response } from 'express';
import { UnauthorizedError } from '@/core/errors';
import Notification, { NotificationType } from '@/core/notification';
import { User } from '@/core/user';
import { devSchema } from './notification.valid';

@Controller()
class NotificationController {
  async getAll(req: Request, res: Response) {
    const notification = new Notification(NotificationType.GENERAL, req.userId!);
    const notif = await notification.getAll();
    if (notif.error) {
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Ok, notif.result);
  }
  @Validate(devSchema)
  async subscribe(req: Request, res: Response) {
    const user = new User(req.userId!);
    const error = await user.addDevice(req.body.device);
    if (error) {
      if (error instanceof UnauthorizedError) {
        throw new RequestError(error.message, HttpStatus.Unauthorized);
      }
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Created);
  }
  @Validate(devSchema)
  async unsubscribe(req: Request, res: Response) {
    const user = new User(req.userId!);
    const error = await user.removeDevice(req.body.device);
    if (error) {
      if (error instanceof UnauthorizedError) {
        throw new RequestError(error.message, HttpStatus.Unauthorized);
      }
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Ok);
  }
}

export default new NotificationController();
