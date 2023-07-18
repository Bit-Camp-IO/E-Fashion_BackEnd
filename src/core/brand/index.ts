import BrandModel from '@/database/models/brand';
import { BrandData, BrandDoc, BrandResult } from './interfaces';
import { AsyncSafeResult } from '@type/common';
import { DuplicateError, NotFoundError } from '../errors';

export async function createBrand(data: BrandData): AsyncSafeResult<BrandResult> {
  try {
    const brand = await BrandModel.create({
      name: data.name,
      description: data.description,
      link: data.link,
      logo: data.logo,
    });
    return { result: _formatBrand(brand), error: null };
  } catch (err) {
    if (err.code === 11000) {
      return { error: new DuplicateError('Brand with name ' + data.name), result: null };
    }
    return { error: err, result: null };
  }
}

export async function getAllBrands(): AsyncSafeResult<BrandResult[]> {
  try {
    const brands = await BrandModel.find();
    const result = brands.map(brand => _formatBrand(brand));
    return { result: result, error: null };
  } catch (err) {
    return { error: err, result: null };
  }
}

export async function updateBrand(
  id: string,
  data: Partial<BrandData>,
): AsyncSafeResult<BrandResult> {
  try {
    const brand = await BrandModel.findByIdAndUpdate(id, { $set: data }, { new: true });
    if (!brand) {
      throw new NotFoundError('Brand with id' + id);
    }
    return { result: _formatBrand(brand), error: null };
  } catch (err) {
    return { error: err, result: null };
  }
}
// TODO: Remove logo from fs
export async function removeBrand(id: string): Promise<Error | null> {
  try {
    const brand = await BrandModel.findById(id);
    if (!brand) return new NotFoundError('Brand with ' + id);
    await BrandModel.findByIdAndRemove(id);
    return null;
  } catch (err) {
    return err;
  }
}

function _formatBrand(doc: BrandDoc): BrandResult {
  return {
    id: doc.id.toString(),
    name: doc.name,
    description: doc.description || '',
    logo: doc.logo || '',
    link: doc.link,
  };
}
