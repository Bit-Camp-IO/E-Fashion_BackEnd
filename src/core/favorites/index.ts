import ProductModel, { ProductDB } from '@/database/models/product';
import { NotFoundError, UnauthorizedError } from '../errors';
import UserModel from '@/database/models/user';
import { FavItem } from './interface';
import { AsyncSafeResult } from '@type/common';

export class Favorites {
  constructor(private userId: string) {}

  async add(productId: string, populate: boolean): AsyncSafeResult<string[] | FavItem[]> {
    try {
      const product = await ProductModel.findById(productId);
      if (!product)
        return { error: new NotFoundError('Product with id ' + productId), result: null };
      let user = await UserModel.findByIdAndUpdate(
        this.userId,
        {
          $addToSet: { favorites: product._id },
        },
        { new: true },
      );
      if (!user) return { error: new UnauthorizedError(), result: null };
      if (!populate) {
        return { result: user.favorites, error: null };
      }
      await user.populate<{ favorites: ProductDB[] }>('favorites');
      const result: FavItem[] = this._format(user.favorites);
      return { result: result, error: null };
    } catch (err) {
      return { error: err, result: null };
    }
  }

  async remove(id: string): Promise<Error | null> {
    try {
      await UserModel.findByIdAndUpdate(this.userId, { $pull: { favorites: id } });
      return null;
    } catch (err) {
      return err;
    }
  }

  async getAll(populate: boolean): AsyncSafeResult<string[] | FavItem[]> {
    try {
      const user = await UserModel.findById(this.userId).exec();
      if (!user) return { error: new UnauthorizedError(), result: null };
      if (!populate) {
        return { result: user.favorites, error: null };
      }
      await user.populate<{ favorites: ProductDB[] }>('favorites');
      const result: FavItem[] = this._format(user.favorites);
      return { result: result, error: null };
    } catch (err) {
      return { error: err, result: null };
    }
  }

  _format(favorites: ProductDB[]): FavItem[] {
    return favorites.map(f => ({
      id: f._id,
      title: f.title,
      price: f.price,
      imageUrl: f.imagesURL[0],
    }));
  }
}
