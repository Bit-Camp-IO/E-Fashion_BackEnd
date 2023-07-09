import {Controller, Validate} from '@server/decorator';
import RequestError from '@server/utils/errors';
import {wrappResponse} from '@server/utils/response';
import {HttpStatus} from '@server/utils/status';
import {Request, Response} from 'express';
import {AdminBody, adminSchema, createProductSchema} from '../valid';
import {AdminRole, getAdminServices} from '@/core/admin';
import {DuplicateUserError, PermissionError, UnauthorizedError} from '@/core/errors';

@Controller()
class AdminController {
  @Validate(createProductSchema)
  public async addProduct(req: Request, res: Response) {
    const {result: admin, error} = await getAdminServices(req.userId!, AdminRole.ADMIN);
    if (error) {
      // TODO: Hadnle Errors
      throw RequestError._500();
    }
    const product = await admin.addProduct(req.body);
    if (product.error) {
      // TODO: Hadnle Errors
      throw RequestError._500();
    }
    res.status(HttpStatus.Created).json(wrappResponse(product.result, HttpStatus.Created));
  }

  @Validate(adminSchema)
  public async createAdmin(req: Request, res: Response) {
    const {result: superAdmin, error} = await getAdminServices(req.userId!, AdminRole.SUPER_ADMIN);
    if (error) {
      if (error instanceof UnauthorizedError) {
        throw new RequestError(error.message, HttpStatus.Unauthorized);
      }
      throw RequestError._500();
    }
    const body: AdminBody = req.body;
    const newAdmin = await superAdmin.createAdmin({
      email: body.email,
      name: body.name,
      password: body.password,
      phone: body.phone,
      address: body.address,
    });
    if (newAdmin.error) {
      if (newAdmin.error instanceof DuplicateUserError) {
        throw new RequestError(newAdmin.error.message, HttpStatus.BadRequest);
      }
      throw RequestError._500();
    }
    res.status(HttpStatus.Created).json(wrappResponse(newAdmin.result, HttpStatus.Created));
  }

  public async removeAdmin(req: Request, res: Response) {
    const {id} = req.body;
    if (!id) {
      throw new RequestError('Require admin id to remove', HttpStatus.BadRequest);
    }
    const {result: superAdmin, error} = await getAdminServices(req.userId!, AdminRole.SUPER_ADMIN);
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
    res.sendStatus(HttpStatus.NoContent);
  }
  public async getAllAdmins(req: Request, res: Response) {
    let role = (req.query['role'] as string) || 'all';
    if (!['super', 'admin'].includes(role)) role = 'all';
    const {result: superAdmin, error} = await getAdminServices(req.userId!, AdminRole.SUPER_ADMIN);
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
    res.status(HttpStatus.Ok).json(wrappResponse(adminsList.result, HttpStatus.Ok));
  }

  public async getAllUsers(req: Request, res: Response) {
    const {result: admin, error} = await getAdminServices(
      req.userId!,
      AdminRole.ADMIN
    );
    if (error) {
      if (error instanceof UnauthorizedError) {
        throw new RequestError(error.message, HttpStatus.Unauthorized);
      }
      throw RequestError._500();
    }
    const users = await admin.getAllUsers();
    res.status(HttpStatus.Ok).json(wrappResponse(users, HttpStatus.Ok));
  }
}

export default new AdminController();
