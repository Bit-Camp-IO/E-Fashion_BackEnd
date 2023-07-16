import { getCategoryForUser } from "@/core/category";
import { Controller } from "@server/decorator";
import RequestError from "@server/utils/errors";
import { HttpStatus } from "@server/utils/status";
import { Request, Response } from "express";

@Controller()
class CategoryController {
    public async getOne(req: Request, res: Response) {
        const { id } = req.params;
        const category = await getCategoryForUser(id);
        if (category.error) {
          throw RequestError._500();
        }
        res.JSON(HttpStatus.Ok, category.result);
    }
}

export default new CategoryController();
