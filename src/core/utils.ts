import { isValidObjectId } from 'mongoose';

export function validateId(id: string) {
  return isValidObjectId(id);
}
