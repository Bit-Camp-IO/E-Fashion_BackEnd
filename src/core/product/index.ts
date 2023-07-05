import ProductModel from '@/database/models/product';

export interface ProductData {
  title: string;
  description: string;
  price: number;
  colors: { name: string; hex: string };
  sizes: string[];
  adminId: string;
}

export interface ProductResult {
  title: string;
  description: string;
  price: number;
  colors: { name: string; hex: string }[];
  sizes: string[];
  id: string;
}

class Product {
  constructor() {}
  static async create(data: ProductData, adminId: string) {
    try {
      const product = await ProductModel.create({
        title: data.title,
        description: data.description,
        addedBy: adminId,
        price: data.price,
        sizes: data.sizes,
        colors: data.colors,
      });
      const result: ProductResult = {
        title: product.title,
        description: product.description,
        price: product.price,
        sizes: product.sizes || [],
        colors: product.colors || [],
        id: product._id.toString(),
      };
      return result;
    } catch (err) {
      throw err;
    }
  }
}

export default Product;
