import CategoryModel from "@/database/models/categorie"
import { CategoryData, CategoryResult } from "./interfaces"
import { AsyncSafeResult } from "@type/common"

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
