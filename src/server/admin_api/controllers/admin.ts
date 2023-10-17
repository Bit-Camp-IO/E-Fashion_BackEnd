import { Controller, Guard, Validate } from '@server/decorator';
import RequestError from '@server/utils/errors';
import { HttpStatus } from '@server/utils/status';
import { Request, Response } from 'express';
import { AdminBody, adminSchema } from '../valid';
import { AdminRole, getAdminServices } from '@/core/admin';
import { DuplicateError, NotFoundError, PermissionError, UnauthorizedError } from '@/core/errors';
import { Admin, SuperAdmin } from '@/core/admin/admin';

@Controller()
class AdminController {
  @Validate(adminSchema)
  @Guard(AdminRole.SUPER_ADMIN)
  public async createAdmin(req: Request, res: Response) {
    const superAdmin = req.admin as SuperAdmin;
    const body: AdminBody = req.body;
    const newAdmin = await superAdmin.createAdmin({
      email: body.email,
      name: body.name,
      password: body.password,
      phone: body.phone,
      address: body.address,
    });
    if (newAdmin.error) {
      if (newAdmin.error instanceof DuplicateError) {
        throw new RequestError(newAdmin.error.message, HttpStatus.BadRequest);
      }
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Created, newAdmin.result);
  }

  public async removeAdmin(req: Request, res: Response) {
    const id = req.params['id'].toString();
    if (!id) {
      throw new RequestError('Require admin id to remove', HttpStatus.BadRequest);
    }
    const { result: superAdmin, error } = await getAdminServices(
      req.userId!,
      AdminRole.SUPER_ADMIN,
    );
    if (error) {
      if (error instanceof UnauthorizedError) {
        throw new RequestError(error.message, HttpStatus.Unauthorized);
      }
      throw RequestError._500();
    }
    const err = await superAdmin.removeAdmin(id);
    if (err) {
      if (err instanceof PermissionError) {
        throw new RequestError(err.message, HttpStatus.Unauthorized);
      }
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Ok);
  }
  public async getAllAdmins(req: Request, res: Response) {
    let role = (req.query['role'] as string) || 'all';
    if (!['super', 'admin'].includes(role)) role = 'all';
    const { result: superAdmin, error } = await getAdminServices(
      req.userId!,
      AdminRole.SUPER_ADMIN,
    );
    if (error) {
      if (error instanceof UnauthorizedError) {
        throw new RequestError(error.message, HttpStatus.Unauthorized);
      }
      throw RequestError._500();
    }
    const adminsList = await superAdmin.getAdminsList(role);

    if (adminsList.error) {
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Ok, adminsList.result);
  }

  public async getAllUsers(req: Request, res: Response) {
    const { result: admin, error } = await getAdminServices(req.userId!, AdminRole.ADMIN);
    if (error) {
      if (error instanceof UnauthorizedError) {
        throw new RequestError(error.message, HttpStatus.Unauthorized);
      }
      throw RequestError._500();
    }
    const users = await admin.getAllUsers();
    res.JSON(HttpStatus.Ok, users.result);
  }

  public async getOneUser(req: Request, res: Response) {
    const { id } = req.params;
    const { result: admin, error } = await getAdminServices(req.userId!, AdminRole.ADMIN);
    if (error) {
      if (error instanceof UnauthorizedError) {
        throw new RequestError(error.message, HttpStatus.Unauthorized);
      }
      throw RequestError._500();
    }
    const user = await admin.getOneUser(id);
    res.JSON(HttpStatus.Ok, user.result);
  }

  @Guard(AdminRole.ADMIN)
  public async banUser(req: Request, res: Response) {
    const { id } = req.params;
    const admin = req.admin as Admin;
    const result = await admin.banUser(id);
    if (result instanceof Error) {
      throw new RequestError(result.message, HttpStatus.BadRequest);
    }
    res.JSON(HttpStatus.Ok, result);
  }

  @Guard(AdminRole.ADMIN)
  public async unBanUser(req: Request, res: Response) {
    const { id } = req.params;
    const admin = req.admin as Admin;
    const result = await admin.unBanUser(id);
    if (result instanceof Error) {
      throw new RequestError(result.message, HttpStatus.BadRequest);
    }
    res.JSON(HttpStatus.Ok, result);
  }

  @Guard(AdminRole.ADMIN)
  public async acceptChat(req: Request, res: Response) {
    const { id } = req.params;
    const admin = req.admin as Admin;
    const error = await admin.acceptChat(id);
    if (error) {
      if (error instanceof NotFoundError) {
        throw new RequestError(error.message, HttpStatus.NotFound);
      }
      throw RequestError._500();
    }
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
    res.JSON(HttpStatus.Ok, chat.result)
  }

  @Guard(AdminRole.ADMIN)
  public async closeChat(req: Request, res: Response) {
    const { id } = req.params;
    const admin = req.admin as Admin;
    const error = await admin.closeChat(id);
    if (error) {
      if (error instanceof NotFoundError) {
        throw new RequestError(error.message, HttpStatus.NotFound);
      }
      throw RequestError._500()
    }
    res.JSON(HttpStatus.Accepted, null);
  }
}

export default new AdminController();
