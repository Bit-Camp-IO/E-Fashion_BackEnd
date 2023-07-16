export interface CategoryData{
    addedBy?: string;
    name: string;
    description: string;
    isMain?: boolean;
}

export interface CategoryResult {
    id: string;
    name: string;
    description: string;
    imagesURL: string[];
    isMain: boolean;
    subCategories: string[];
}
