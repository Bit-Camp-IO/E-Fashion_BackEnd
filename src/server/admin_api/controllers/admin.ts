import { Controller, Guard, Validate } from '@server/decorator';
import RequestError, { handleResultError, unwrapResult } from '@server/utils/errors';
import { HttpStatus } from '@server/utils/status';
import { Request, Response } from 'express';
import { AdminBody, adminSchema } from '../valid';
import { AdminRole, getAdminServices } from '@/core/admin';
// import { DuplicateError, PermissionError, UnauthorizedError } from '@/core/errors';
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
    // if (newAdmin.error) {
    //   if (newAdmin.error instanceof DuplicateError) {
    //     throw new RequestError(newAdmin.error.message, HttpStatus.BadRequest);
    //   }
    //   throw RequestError._500();
    // }
    const result = unwrapResult(newAdmin);
    res.JSON(HttpStatus.Created, result);
  }

  public async removeAdmin(req: Request, res: Response) {
    const id = req.params['id'].toString();
    if (!id) {
      throw new RequestError('Require admin id to remove', HttpStatus.BadRequest);
    }
    let { result: superAdmin, error } = await getAdminServices(req.userId!, AdminRole.SUPER_ADMIN);
    // if (error) {
    //   if (error instanceof UnauthorizedError) {
    //     throw new RequestError(error.message, HttpStatus.Unauthorized);
    //   }
    //   throw RequestError._500();
    // }
    if (error) {
      handleResultError(error);
    }
    error = await superAdmin!.removeAdmin(id);
    // if (err) {
    //   if (err instanceof PermissionError) {
    //     throw new RequestError(err.message, HttpStatus.Unauthorized);
    //   }
    //   throw RequestError._500();
    // }
    if (error) {
      handleResultError(error);
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
    // if (error) {
    //   if (error instanceof UnauthorizedError) {
    //     throw new RequestError(error.message, HttpStatus.Unauthorized);
    //   }
    //   throw RequestError._500();
    // }
    if (error) {
      handleResultError(error);
    }
    const adminsList = await superAdmin.getAdminsList(role);

    // if (adminsList.error) {
    //   throw RequestError._500();
    // }
    const result = unwrapResult(adminsList);
    res.JSON(HttpStatus.Ok, result);
  }

  public async getAllUsers(req: Request, res: Response) {
    const { result: admin, error } = await getAdminServices(req.userId!, AdminRole.ADMIN);
    // if (error) {
    //   if (error instanceof UnauthorizedError) {
    //     throw new RequestError(error.message, HttpStatus.Unauthorized);
    //   }
    //   throw RequestError._500();
    // }
    if (error) {
      handleResultError(error);
    }
    const users = await admin.getAllUsers();
    res.JSON(HttpStatus.Ok, users.result);
  }

  public async getOneUser(req: Request, res: Response) {
    const { id } = req.params;
    const { result: admin, error } = await getAdminServices(req.userId!, AdminRole.ADMIN);
    // if (error) {
    //   if (error instanceof UnauthorizedError) {
    //     throw new RequestError(error.message, HttpStatus.Unauthorized);
    //   }
    //   throw RequestError._500();
    // }
    if (error) {
      handleResultError(error);
    }
    const user = await admin.getOneUser(id);
    res.JSON(HttpStatus.Ok, user.result);
  }

  @Guard(AdminRole.ADMIN)
  public async banUser(req: Request, res: Response) {
    const { id } = req.params;
    const admin = req.admin as Admin;
    const error = await admin.banUser(id);
    // if (result instanceof Error) {
    //   throw new RequestError(result.message, HttpStatus.BadRequest);
    // }
    if (error) {
      handleResultError(error);
    }
    res.JSON(HttpStatus.Ok);
  }

  @Guard(AdminRole.ADMIN)
  public async unBanUser(req: Request, res: Response) {
    const { id } = req.params;
    const admin = req.admin as Admin;
    const error = await admin.unBanUser(id);
    // if (error instanceof Error) {
    //   throw new RequestError(error.message, HttpStatus.BadRequest);
    // }
    if (error) {
      handleResultError(error);
    }
    res.JSON(HttpStatus.Ok, error);
  }
}

export default new AdminController();
