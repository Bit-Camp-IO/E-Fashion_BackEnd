import { Controller, Guard } from '@server/decorator';
import RequestError from '@server/utils/errors';
import { HttpStatus } from '@server/utils/status';
import { Request, Response } from 'express';
import { AdminRole } from '@/core/admin';
import { NotFoundError } from '@/core/errors';
import { Admin } from '@/core/admin/admin';
import { SocketEvent, emitUserEvent } from '@server/websocket/sockets';

@Controller()
class AdminController {
  @Guard(AdminRole.ADMIN)
  public async acceptChat(req: Request, res: Response) {
    const { id } = req.params;
    const admin = req.admin as Admin;
    const { result: chat, error } = await admin.acceptChat(id);
    if (error) {
      if (error instanceof NotFoundError) {
        throw new RequestError(error.message, HttpStatus.NotFound);
      }
      throw RequestError._500();
    }
    emitUserEvent(req.app.get('io'), chat.user, SocketEvent.ACCEPT_CHAT);
    res.JSON(HttpStatus.Accepted, null);
  }

  @Guard(AdminRole.ADMIN)
  public async getChats(req: Request, res: Response) {
    const admin = req.admin as Admin;
    const chats = await admin.getActiveChats();
    if (chats.error) {
      if (chats.error instanceof NotFoundError) {
        throw new RequestError(chats.error.message, HttpStatus.NotFound);
      }
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Ok, chats.result);
  }

  @Guard(AdminRole.ADMIN)
  public async getChatByID(req: Request, res: Response) {
    const admin = req.admin as Admin;
    const { id } = req.params;
    const chat = await admin.getChatById(id);
    if (chat.error) {
      if (chat.error instanceof NotFoundError) {
        throw new RequestError(chat.error.message, HttpStatus.NotFound);
      }
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Ok, chat.result);
  }

  @Guard(AdminRole.ADMIN)
  public async closeChat(req: Request, res: Response) {
    const { id } = req.params;
    const admin = req.admin as Admin;
    const { result: chat, error } = await admin.closeChat(id);
    if (error) {
      if (error instanceof NotFoundError) {
        throw new RequestError(error.message, HttpStatus.NotFound);
      }
      throw RequestError._500();
    }
    emitUserEvent(req.app.get('io'), chat.user, SocketEvent.CLOSE_CHAT);
    res.JSON(HttpStatus.Accepted, null);
  }
}

export default new AdminController();
