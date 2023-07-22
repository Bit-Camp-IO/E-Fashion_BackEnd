import { isValidObjectId } from 'mongoose';
import fs from 'fs/promises';

export function validateId(id: string): boolean {
  return isValidObjectId(id);
}

export async function removeFile(path: string): Promise<void> {
  try {
    await fs.unlink(path);
  } catch (err) {
    return;
  }
}
