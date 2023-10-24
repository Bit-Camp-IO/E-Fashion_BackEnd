import { Controller, Validate } from '@server/decorator';
import RequestError from '@server/utils/errors';
import { HttpStatus } from '@server/utils/status';
import { Request, Response } from 'express';
import { createChat, getChatMessages, getUserChat, saveMessageToChat } from '@/core/chat';
import { DuplicateError, NotFoundError, UnauthorizedError } from '@/core/errors';
import { NewMessageSchema, newMessageSchema } from './chat.valid';
import { validateId } from '@/core/utils';
import { SocketEvent, emitUserEvent, inWebSocket } from '@server/websocket/sockets';
import Notification, { NotificationType } from '@/core/notification';

@Controller()
class UserController {
  async newChat(req: Request, res: Response) {
    const userId = req.userId!;
    const chat = await createChat(userId);
    if (chat.error) {
      if (chat.error instanceof DuplicateError)
        throw new RequestError(chat.error, HttpStatus.BadRequest);
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Created, chat.result);
  }

  async getChat(req: Request, res: Response) {
    const userId = req.userId!;
    const chat = await getUserChat(userId);

    if (chat.error) {
      if (chat.error instanceof NotFoundError)
        throw new RequestError(chat.error, HttpStatus.NotFound);

      throw RequestError._500();
    }

    res.JSON(HttpStatus.Ok, chat.result);
  }

  @Validate(newMessageSchema)
  async sendMessage(req: Request, res: Response) {
    const body: NewMessageSchema = req.body;
    const chatId = req.params['id'];
    if (!validateId(chatId)) throw new RequestError('Invalid Chat id', HttpStatus.BadRequest);

    const message = await saveMessageToChat(chatId, req.userId!, body.content);
    if (message.error) {
      if (message.error instanceof NotFoundError) {
        throw new RequestError(message.error, HttpStatus.BadRequest);
      }
      if (message.error instanceof UnauthorizedError) {
        throw new RequestError(message.error, HttpStatus.Unauthorized);
      }
      throw RequestError._500();
    }
    if (inWebSocket(message.result.to)) {
      emitUserEvent(req.app.get('io'), message.result.to, SocketEvent.NEW_MESSAGE, {
        ...message.result.message,
        me: false,
      });
    } else {
      const notif = new Notification(NotificationType.NEW_MESSAGE, message.result.to);
      await notif.push({
        title: 'New Message',
        body: message.result.message.content,
      });
    }
    res.JSON(HttpStatus.Created, message.result.message);
  }
  async getMessages(req: Request, res: Response) {
    const messages = await getChatMessages(req.params['id'], req.userId!);
    if (messages.error) {
      if (messages.error instanceof NotFoundError) {
        throw new RequestError(messages.error, HttpStatus.BadRequest);
      }
      if (messages.error instanceof UnauthorizedError) {
        throw new RequestError(messages.error, HttpStatus.Unauthorized);
      }
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Ok, messages.result);
  }
}

export default new UserController();
