import ProductModel, { ProductDB } from '@/database/models/product';
import { AsyncSafeResult } from '@type/common';
import { NotFoundError } from '../errors';
import { Document } from 'mongoose';
import { CreateProductReturn, ProductData, ProductItemApi, ProductResult } from './interfaces';
export * from './interfaces';

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
    return { result, error: null };
  } catch (err) {
    return { error: err, result: null };
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
    return { result: productResult, error: null };
  } catch (err) {
    return { error: err, result: null };
  }
}

export async function getProductForUser(id: string): AsyncSafeResult<ProductResult> {
  try {
    const product = await _getProduct(id);
    const result: ProductResult = _formatProduct(product);
    return { result, error: null };
  } catch (err) {
    return { error: err, result: null };
  }
}

export async function getProductsList(): AsyncSafeResult<ProductItemApi[]> {
  try {
    const products = await ProductModel.find({});
    const result: ProductItemApi[] = products.map(p => _formatProduct(p));
    return { result, error: null };
  } catch (error) {
    return { result: null, error };
  }
}

export async function removeProduct(id: string): Promise<Error | null> {
  try {
    const product = await ProductModel.findById(id);
    if (!product) return new NotFoundError('Product with ' + id);
    // TODO: Remove image from file System
    await ProductModel.findByIdAndRemove(id);
    return null;
  } catch (err) {
    return err;
  }
}

interface ProductDoc extends Document, ProductDB {}

function _formatProduct(pDoc: ProductDoc): ProductItemApi {
  return {
    id: pDoc._id.toString(),
    title: pDoc.title,
    description: pDoc.description,
    price: pDoc.price - (pDoc.discount || 0 * pDoc.price),
    available: pDoc.available,
    brand: pDoc.brandName || '',
    discount: pDoc.discount || 0,
    imagesUrl: pDoc.imagesURL,
    isNew: pDoc.is_new,
    oldPrice: pDoc.price,
    rate: pDoc.rate || 0,
    colors: pDoc.colors || [],
    sizes: pDoc.sizes || [],
  };
}
