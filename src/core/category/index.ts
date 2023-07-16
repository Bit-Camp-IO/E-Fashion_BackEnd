import CategoryModel, { CategorieDB } from "@/database/models/categorie"
import { CategoryData, CategoryResult } from "./interfaces"
import { AsyncSafeResult } from "@type/common"
import { NotFoundError } from "../errors";
import { Document } from "mongoose";

export async function createCategory(data: CategoryData, adminId: string): AsyncSafeResult<CategoryResult> {
    try {
        const category = await CategoryModel.create({
            addedBy: adminId,
            description: data.description,
            isMain: false,
            name: data.name,
        })
        return { result: _formatCategory(category), error: null }
    } catch (err) {
        return { error: err, result: null }
    }
}

export async function getCategoryForUser(id: string): AsyncSafeResult<CategoryResult> {
    try {
      const category = await CategoryModel.findById(id);
      if (!category) {
        throw new NotFoundError("Category with id"+ id);
      }
      return { result: _formatCategory(category), error: null };
    } catch (err) {
      return { error: err, result: null };
    }
  }
export async function addSubCategory(data: CategoryData, id: string, adminId: string): AsyncSafeResult<CategoryResult> {
    try {
        const subCategory = await CategoryModel.create({
            addedBy: adminId,
            description: data.description,
            isMain: false,
            name: data.name,
        })
        const category = await CategoryModel.findByIdAndUpdate(id, { $push: {subCategories: subCategory} });
        if (!category) {
            throw new NotFoundError("Category with id" + id);
        }
        
        return { result: _formatCategory(category), error: null };
    } catch (err) {
        return { error: err, result: null }
    }
}

export async function getAllCategories(): AsyncSafeResult<CategoryResult[]> {
    try {
      const categories = await CategoryModel.find({});
      const result: CategoryResult[] = categories.map(category => _formatCategory(category));
      return { result, error: null };
    } catch (err) {
      return { error: err, result: null };
    }
  }

export async function updateCategory(id: string, cData: Partial<CategoryData>): AsyncSafeResult<CategoryResult> {
    try {
        const category = await CategoryModel.findByIdAndUpdate(id, { $set: cData }, { new: true });
        if (!category) {
            throw new NotFoundError("Category with id" + id);
        }
        return { result: _formatCategory(category), error: null }
    } catch (err) {
        return { error: err, result: null };
    }
}

export async function removeCategory(id: string): Promise<Error | null> {
    try {
      const category = await CategoryModel.findById(id);
      if (!category) return new NotFoundError('Category with ' + id);
      await CategoryModel.findByIdAndRemove(id);
      return null;
    } catch (err) {
      return err;
    }
  }
  

interface CategoryDoc extends Document, CategorieDB {};

function _formatCategory(cDoc: CategoryDoc): CategoryResult {
    return {
      id: cDoc.id.toString(),
      name: cDoc.name,
      description: cDoc.description || '',
      imagesURL: cDoc.imagesURL || '',
      isMain: cDoc.isMain || false,
      subCategories: cDoc.subCategories.map(subCategory => subCategory?.toString() || ''),
    };
  }