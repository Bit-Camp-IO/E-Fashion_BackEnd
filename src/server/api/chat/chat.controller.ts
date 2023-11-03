import { Controller, Validate } from '@server/decorator';
import RequestError, { unwrapResult } from '@server/utils/errors';
import { HttpStatus } from '@server/utils/status';
import { Request, Response } from 'express';
import { createChat, getChatMessages, getUserChat, saveMessageToChat } from '@/core/chat';
import { NewMessageSchema, newMessageSchema } from './chat.valid';
import { validateId } from '@/core/utils';
import { SocketEvent, emitUserEvent, inWebSocket } from '@server/websocket/sockets';
import Notification, { NotificationType } from '@/core/notification';

@Controller()
class UserController {
  async newChat(req: Request, res: Response) {
    const userId = req.userId!;
    const chat = await createChat(userId);
    // if (chat.error) {
    //   if (chat.error instanceof DuplicateError)
    //     throw new RequestError(chat.error, HttpStatus.BadRequest);
    //   throw RequestError._500();
    // }
    unwrapResult(chat);
    res.JSON(HttpStatus.Created, chat.result);
  }

  async getChat(req: Request, res: Response) {
    const userId = req.userId!;
    const chat = await getUserChat(userId);

    // if (chat.error) {
    //   if (chat.error instanceof NotFoundError)
    //     throw new RequestError(chat.error, HttpStatus.NotFound);

    //   throw RequestError._500();
    // }
    unwrapResult(chat);
    res.JSON(HttpStatus.Ok, chat.result);
  }

  @Validate(newMessageSchema)
  async sendMessage(req: Request, res: Response) {
    const body: NewMessageSchema = req.body;
    const chatId = req.params['id'];
    if (!validateId(chatId)) throw new RequestError('Invalid Chat id', HttpStatus.BadRequest);

    const messageResult = await saveMessageToChat(chatId, req.userId!, body.content);
    // if (message.error) {
    //   if (message.error instanceof NotFoundError) {
    //     throw new RequestError(message.error, HttpStatus.BadRequest);
    //   }
    //   if (message.error instanceof UnauthorizedError) {
    //     throw new RequestError(message.error, HttpStatus.Unauthorized);
    //   }
    //   throw RequestError._500();
    // }
    const message = unwrapResult(messageResult);
    if (inWebSocket(message.to)) {
      emitUserEvent(req.app.get('io'), message.to, SocketEvent.NEW_MESSAGE, {
        ...message.message,
        me: false,
      });
    } else {
      const notification = new Notification(NotificationType.NEW_MESSAGE, message.to);
      await notification.push({
        title: 'New Message',
        body: message.message.content,
      });
    }
    res.JSON(HttpStatus.Created, message.message);
  }
  async getMessages(req: Request, res: Response) {
    const messages = await getChatMessages(req.params['id'], req.userId!);
    // if (messages.error) {
    //   if (messages.error instanceof NotFoundError) {
    //     throw new RequestError(messages.error, HttpStatus.BadRequest);
    //   }
    //   if (messages.error instanceof UnauthorizedError) {
    //     throw new RequestError(messages.error, HttpStatus.Unauthorized);
    //   }
    //   throw RequestError._500();
    // }
    unwrapResult(messages);
    res.JSON(HttpStatus.Ok, messages.result);
  }
}

export default new UserController();
