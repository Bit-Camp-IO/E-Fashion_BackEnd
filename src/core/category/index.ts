import CategoryModel, { CategorieDB } from '@/database/models/categorie';
import { CategoryData, CategoryResult } from './interfaces';
import { AsyncSafeResult } from '@type/common';
import { DuplicateError, NotFoundError } from '../errors';
import { removeFile } from '../utils';
import { join } from 'path';
import Config from '@/config';

export async function createCategory(
  data: CategoryData,
  adminId: string,
): AsyncSafeResult<CategoryResult> {
  try {
    const category = await CategoryModel.create({
      addedBy: adminId,
      description: data.description,
      isMain: true,
      name: data.name,
      imageURL: data.image,
    });
    return { result: _formatCategory(category), error: null };
  } catch (err) {
    if (err.code === 11000) {
      return { error: new DuplicateError('Category with name ' + data.name), result: null };
    }
    return { error: err, result: null };
  }
}

export async function getCategoryForUser(id: string): AsyncSafeResult<CategoryResult> {
  try {
    const category = await CategoryModel.findById(id);
    if (!category) {
      throw new NotFoundError('Category with id' + id);
    }
    return { result: _formatCategory(category), error: null };
  } catch (err) {
    return { error: err, result: null };
  }
}

export async function addSubCategory(
  data: CategoryData,
  id: string,
  adminId: string,
): AsyncSafeResult<CategoryResult> {
  try {
    const subCategory = await CategoryModel.create({
      addedBy: adminId,
      description: data.description,
      isMain: false,
      name: data.name,
      imageURL: data.image,
    });
    const category = await CategoryModel.findByIdAndUpdate(id, {
      $push: { subCategories: subCategory },
    });
    if (!category) {
      throw new NotFoundError('Category with id' + id);
    }

    return { result: _formatCategory(category), error: null };
  } catch (err) {
    return { error: err, result: null };
  }
}

export async function getAllCategories(): AsyncSafeResult<CategoryResult[]> {
  try {
    const categories = await CategoryModel.find({ isMain: true }).populate('subCategories');
    const result = categories.map(category => _formatCategory(category));
    return { result: result, error: null };
  } catch (err) {
    return { error: err, result: null };
  }
}

export async function updateCategory(
  id: string,
  cData: Partial<CategoryData>,
): AsyncSafeResult<CategoryResult> {
  try {
    const category = await CategoryModel.findByIdAndUpdate(id, { $set: cData }, { new: true });
    if (!category) {
      throw new NotFoundError('Category with id' + id);
    }
    return { result: _formatCategory(category), error: null };
  } catch (err) {
    return { error: err, result: null };
  }
}

export async function removeCategory(id: string): Promise<Error | null> {
  try {
    const category = await CategoryModel.findById(id);
    if (!category) return new NotFoundError('Category with ' + id);
    await removeFile(join(Config.CatImagesDir, category.imageURL));
    await CategoryModel.findByIdAndRemove(id);
    return null;
  } catch (err) {
    return err;
  }
}

function _formatCategory(cDoc: CategorieDB): CategoryResult {
  return {
    id: cDoc.id.toString(),
    name: cDoc.name,
    description: cDoc.description || '',
    imageURL: cDoc.imageURL,
    subCategories: cDoc.subCategories
      ? cDoc.subCategories.map(category => _formatCategory(category))
      : [],
  };
}
