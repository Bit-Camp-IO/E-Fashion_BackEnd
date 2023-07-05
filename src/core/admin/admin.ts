import AdminModel from '@/database/models/admin';
import Product, { ProductData, ProductResult } from '../product';
import { SafeResult } from '@type/common';


class Admin {
  private id: string
  private constructor() {}
  static async getById(id: string): Promise<Admin> {
    const adminDB = await AdminModel.findById(id);
    if (!adminDB) {
      // TODO: create error for no admin
      throw new Error('');
    }
    const admin = new Admin();
    admin.id = adminDB._id.toString()
    return admin;
  }
  async addProduct(data: ProductData):Promise<SafeResult<ProductResult>> {
    try{
    const product = await Product.create(data, this.id);
    return {
      result: product,
      error:null
    }
    }catch(err){
      return {
        error: err,
        result:null
      }
    }
  }
}

export default Admin;
