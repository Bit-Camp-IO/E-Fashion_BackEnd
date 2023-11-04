import CollectionModel, { CollectionDB } from '@/database/models/collection';
import { AsyncSafeResult } from '../types';
import { CollectionInput, CollectionListResult, CollectionResult } from './interfaces';
import { AppError } from '../errors';

export * from './interfaces';

class Collection {
  async create(data: CollectionInput): AsyncSafeResult<CollectionResult> {
    try {
      const collection = await CollectionModel.create(data);
      return { result: this._formatCollection(collection), error: null };
    } catch (error) {
      return { error, result: null };
    }
  }

  async edit(id: string, data: Partial<CollectionInput>): AsyncSafeResult<CollectionResult> {
    try {
      const collection = await CollectionModel.findByIdAndUpdate(id, data, { new: true });
      if (!collection) {
        throw AppError.notFound('Collection not found.');
      }
      return { result: this._formatCollection(collection), error: null };
    } catch (error) {
      return { error, result: null };
    }
  }

  async remove(id: string): Promise<Error | null> {
    try {
      const collection = await CollectionModel.findByIdAndDelete(id);
      if (!collection) {
        throw AppError.notFound('Collection not found.');
      }
      return null;
    } catch (error) {
      return error;
    }
  }

  async getOne(id: string): AsyncSafeResult<CollectionResult> {
    try {
      const collection = await CollectionModel.findById(id);
      if (!collection) {
        throw AppError.notFound('Collection not found.');
      }
      return { result: this._formatCollection(collection), error: null };
    } catch (error) {
      return { error, result: null };
    }
  }

  async getAll(): AsyncSafeResult<CollectionListResult> {
    try {
      const collections = await CollectionModel.find({}, { items: 0 });
      return { result: collections.map(c => this._formatCollection(c)), error: null };
    } catch (error) {
      return { error, result: null };
    }
  }

  private _formatCollection(c: CollectionDB): CollectionResult {
    return {
      id: c._id,
      title: c.title,
      description: c.description,
      discount: c.discount,
      price: c.price,
      items: c.items,
      image: c.image,
    };
  }
}

export default new Collection();
