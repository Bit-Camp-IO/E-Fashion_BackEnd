import { AdminRole } from "@/core/admin";
import { Controller, Guard, Validate } from "@server/decorator";
import { CreateCategorySchema, createCategorySchema } from "../valid";
import {Request, Response} from 'express';
import { Admin } from "@/core/admin/admin";
import { CategoryData } from "@/core/category/interfaces";
import RequestError from "@server/utils/errors";
import { HttpStatus } from "@server/utils/status";

@Controller()
class CategoryController {
    @Validate(createCategorySchema)
    @Guard(AdminRole.ADMIN)
    public async create(req: Request, res: Response) {
        const admin = req.admin as Admin;
        const body: CreateCategorySchema= req.body;
        const categoryData: CategoryData = {
            name: body.name,
            description: body.description,
        }
        const category = await admin.addCategory(categoryData);
        if (category.error) {
            throw RequestError._500();
        }
        res.JSON(HttpStatus.Created, category.result);
    }

    @Validate(createCategorySchema)
    @Guard(AdminRole.ADMIN)
    public async createSub(req: Request, res: Response) {
        const admin = req.admin as Admin;
        const { id } = req.params;
        const body: CreateCategorySchema = req.body;
        const categoryData: CategoryData = {
            name: body.name,
            description: body.description,
        } 
        const category = await admin.addSub(categoryData, id);
        if (category.error) {
            console.log(category.error.message)
            throw RequestError._500();
        }
        res.JSON(HttpStatus.Created, category.result);
    }
}

export default new CategoryController();