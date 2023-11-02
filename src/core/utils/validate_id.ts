import { isValidObjectId } from 'mongoose';

export function validateId(id: string): boolean {
  return isValidObjectId(id);
}
