import Product from "@/core/product";
import { Controller, Validate } from "@server/decorator";
import { wrappResponse } from "@server/utils/response";
import { HttpStatus } from "@server/utils/status";
import { Request, RequestHandler, Response } from "express";
import { CreateProductSchema, createProductSchema } from "./product.valid";

interface IProduct {
  getAll: RequestHandler,
  getOne: RequestHandler,
  create: RequestHandler,
  update: RequestHandler,
  delete: RequestHandler
}

@Controller()
class ProductController implements IProduct {
  public async getAll(_: Request, res: Response) {
    const products = await Product.getAll();
    res.status(HttpStatus.Ok).json(wrappResponse(products, HttpStatus.Ok));
  };

  getOne (req: Request, res: Response) {
    // TODO: Implement the logic to retrieve a specific product
    const productId = req.params.id;
    res.status(HttpStatus.Ok).json({ message: `Retrieved product ${productId}` });
  };

  @Validate(createProductSchema)
  public async create (req: Request, res: Response) {
    // TODO: Check for admin id
    const body: CreateProductSchema = req.body;
    const product = await Product.create(body)
    res.status(HttpStatus.Created).json(wrappResponse(product, HttpStatus.Created));
  };

  update (req: Request, res: Response) {
    // TODO: Implement the logic to update an existing product
    const productId = req.params.id;
    res.status(HttpStatus.Ok).json({ message: `Updated product ${productId}` });
  };

  delete (req: Request, res: Response) {
    // TODO: Implement the logic to delete a product
    const productId = req.params.id;
    res.status(HttpStatus.Ok).json({ message: `Deleted product ${productId}` });
  };
}

export default new ProductController();