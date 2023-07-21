import { isValidObjectId } from 'mongoose';
import fs from 'fs/promises';
import { join } from 'path';

export function validateId(id: string): boolean {
  return isValidObjectId(id);
}

export async function removeFile(path: string): Promise<void> {
  try {
    await fs.unlink(join(__dirname, '..', '..', 'uploads' + path));
  } catch (err) {
    return;
  }
}
