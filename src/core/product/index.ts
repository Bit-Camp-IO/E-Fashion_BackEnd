import ProductModel, { ProductDB } from '@/database/models/product';
import { AsyncSafeResult } from '@type/common';
import { NotFoundError } from '../errors';
import { Document } from 'mongoose';
import {
  CreateProductReturn,
  ProductData,
  ProductFilterOptions,
  ProductItemApi,
  ProductItemsApiList,
  ProductOptions,
  ProductResult,
  ProductSortOptions,
  ProductsInfo,
} from './interfaces';
import { removeFile } from '../utils';
import Config from '@/config';
import { join } from 'path';
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
      imagesURL: data.imagesUrl,
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

export async function getProductsList(
  options: ProductOptions,
): AsyncSafeResult<ProductItemsApiList> {
  try {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const skipDocsNumber = (page - 1) * limit;
    const productsQuery = ProductModel.find(_filter(options.filter));
    _sort(productsQuery, options.sort);
    const products = await productsQuery.skip(skipDocsNumber).limit(limit).exec();
    const count = await ProductModel.count(_filter(options.filter));
    const result: ProductItemsApiList = {
      products: products.map(p => _formatProduct(p)),
      count: products.length,
      page: page,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
    };
    return { result, error: null };
  } catch (error) {
    return { result: null, error };
  }
}

export async function updateProduct(
  id: string,
  productData: Partial<ProductData>,
): AsyncSafeResult<ProductData> {
  try {
    const product = await ProductModel.findByIdAndUpdate(id, { $set: productData }, { new: true });
    if (!product) throw new NotFoundError('Product with' + id);
    return { result: _formatProduct(product), error: null };
  } catch (err) {
    return { error: err, result: null };
  }
}

export async function removeProduct(id: string): Promise<Error | null> {
  try {
    const product = await ProductModel.findById(id);
    if (!product) return new NotFoundError('Product with ' + id);
    for (const image of product.imagesURL) {
      await removeFile(join(Config.ProductImagesDir, image));
    }
    await ProductModel.findByIdAndRemove(id);
    return null;
  } catch (err) {
    return err;
  }
}

export async function productsInfo(): AsyncSafeResult<ProductsInfo> {
  try {
    const productsInfo = await ProductModel.aggregate([
      { $group: { _id: null, maxPrice: { $max: '$price' }, minPrice: { $min: '$price' } } },
    ]);
    const info = productsInfo[0];
    delete info._id;
    return { result: info, error: null };
  } catch (err) {
    return { error: err, result: null };
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

function _sort(q: any, options?: ProductSortOptions) {
  if (!options) return;
  if (options.price) q.sort({ price: options.price });
  if (options.newness) q.sort({ createdAt: options.newness });
  if (options.popularity) q.sort({ rate: options.popularity });
}

function _filter(options?: ProductFilterOptions) {
  const filter: any = {};
  if (!options) return filter;
  if (options.maxPrice) filter.price = { $lte: options.maxPrice };
  if (options.minPrice) filter.price = { ...filter.price, $gte: options.minPrice };
  return filter;
}
