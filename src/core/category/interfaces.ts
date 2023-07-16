export interface CategoryData{
    name: string;
    description: string;
    isMain?: boolean;
    imagesURL?: string[];
    subCategories?: string[];
}

export interface CategoryResult {
    id: string;
    name: string;
    description: string;
    imagesURL: string[];
    isMain: boolean;
    subCategories: string[];
}
