import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const Dirs = ['/uploads/profile', '/uploads/product', '/uploads/category'];

export function CreateProDir() {
  for (const dir of Dirs) {
    const path = join(__dirname, '..', '..', dir);
    if (existsSync(path)) continue;
    mkdirSync(path, { recursive: true });
  }
}
