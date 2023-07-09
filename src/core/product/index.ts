import ProductModel, {ProductDB} from '@/database/models/product';
import {AsyncSafeResult} from '@type/common';
import {NotFoundError} from '../errors';
import {Document} from 'mongoose';

export interface ProductData {
  title: string;
  description: string;
  price: number;
  colors: {name: string; hex: string};
  sizes: string[];
}

export interface ProductResult {
  title: string;
  description: string;
  price: number;
  colors: {name: string; hex: string}[];
  sizes: string[];
  id: string;
}

type CreateProductReturn = AsyncSafeResult<ProductResult>;

export async function createProduct(data: ProductData, adminId: string): CreateProductReturn {
  try {
    const product = await ProductModel.create({
      title: data.title,
      description: data.description,
      addedBy: adminId,
      price: data.price,
      sizes: data.sizes,
      colors: data.colors,
    });
    const result: ProductResult = _formatProduct(product);
    return {result, error: null};
  } catch (err) {
    return {error: err, result: null};
  }
}

async function _getProduct(id: string) {
  const product = await ProductModel.findById(id);
  if (!product) throw new NotFoundError('Product with id ' + id);
  return product;
}

export async function getProductForAdmin(id: string): AsyncSafeResult<unknown> {
  try {
    const product = (await _getProduct(id)).toObject();
    const productResult = {
      ...product,
      id: product._id.toString(),
    };
    return {result: productResult, error: null};
  } catch (err) {
    return {error: err, result: null};
  }
}

export async function getProductForUser(id: string): AsyncSafeResult<ProductResult> {
  try {
    const product = await _getProduct(id);
    const result: ProductResult = _formatProduct(product);
    return {result, error: null};
  } catch (err) {
    return {error: err, result: null};
  }
}

export async function getAllProducts(): AsyncSafeResult<ProductResult[]> {
  try {
    const products = await ProductModel.find({});
    const result: ProductResult[] = products.map(p => _formatProduct(p));
    return {result, error: null};
  } catch (error) {
    return {result: null, error};
  }
}

export async function removeProduct(id: string): Promise<Error | null> {
  try {
    await ProductModel.findByIdAndDelete(id);
    return null;
  } catch (err) {
    return err;
  }
}

interface ProductDoc extends Document, ProductDB {}

function _formatProduct(pDoc: ProductDoc): ProductResult {
  return {
    colors: pDoc.colors || [],
    description: pDoc.description,
    id: pDoc._id.toString(),
    price: pDoc.price,
    sizes: pDoc.sizes || [],
    title: pDoc.title,
  };
}
