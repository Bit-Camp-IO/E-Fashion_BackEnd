import CategoryModel from "@/database/models/categorie"
import { CategoryData, CategoryResult } from "./interfaces"
import { AsyncSafeResult } from "@type/common"
import { NotFoundError } from "../errors";

export async function createCategory(data: CategoryData, adminId: string): AsyncSafeResult<CategoryResult> {
    try {
        const category = await CategoryModel.create({
            addedBy: adminId,
            description: data.description,
            isMain: data.isMain,
            name: data.name,
        })

        //TODO: edit subCategories as an arr of string || []
        const result: CategoryResult = {
            id: category._id.toString(),
            name: category.name,
            description: category.description || '',
            imagesURL: category.imagesURL,
            isMain: category.isMain,
            subCategories: category.subCategories.map(subCategory => subCategory?.toString() || ''),
          }; 

        return { result, error: null }
    } catch (err) {
        return { error: err, result: null }
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
        await category.save();
        //TODO: edit subCategories as an arr of string || []
        const result: CategoryResult = {
            id: category._id.toString(),
            name: category.name,
            description: category.description || '',
            imagesURL: category.imagesURL,
            isMain: category.isMain, 
            subCategories: category.subCategories.map(subCategory => subCategory?.toString() || '')
          }; 
        return { result, error: null };
    } catch (err) {
        return { error: err, result: null }
    }
}
