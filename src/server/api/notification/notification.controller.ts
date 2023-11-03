import { Controller, Validate } from '@server/decorator';
import { handleResultError, unwrapResult } from '@server/utils/errors';
import { HttpStatus } from '@server/utils/status';
import { Request, Response } from 'express';
import Notification, { NotificationType } from '@/core/notification';
import { User } from '@/core/user';
import { devSchema } from './notification.valid';

@Controller()
class NotificationController {
  async getAll(req: Request, res: Response) {
    const notification = new Notification(NotificationType.GENERAL, req.userId!);
    const notificationResult = await notification.getAll();
    // if (notificationResult.error) {
    //   throw RequestError._500();
    // }
    unwrapResult(notificationResult);
    res.JSON(HttpStatus.Ok, notificationResult.result);
  }

  @Validate(devSchema)
  async subscribe(req: Request, res: Response) {
    const user = new User(req.userId!);
    const error = await user.addDevice(req.body.device);
    // if (error) {
    //   if (error instanceof UnauthorizedError) {
    //     throw new RequestError(error.message, HttpStatus.Unauthorized);
    //   }
    //   throw RequestError._500();
    // }
    if (error) {
      handleResultError(error);
    }
    res.JSON(HttpStatus.Created);
  }

  @Validate(devSchema)
  async unsubscribe(req: Request, res: Response) {
    const user = new User(req.userId!);
    const error = await user.removeDevice(req.body.device);
    // if (error) {
    //   if (error instanceof UnauthorizedError) {
    //     throw new RequestError(error.message, HttpStatus.Unauthorized);
    //   }
    //   throw RequestError._500();
    // }
    if (error) {
      handleResultError(error);
    }
    res.JSON(HttpStatus.Ok);
  }
}

export default new NotificationController();
