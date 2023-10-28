import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const Dirs = ['/uploads/profile', '/uploads/product', '/uploads/category', 'logs'];

export function CreateProDir() {
  for (const dir of Dirs) {
    const path = join(__dirname, '..', '..', dir);
    if (existsSync(path)) continue;
    mkdirSync(path, { recursive: true });
  }
}
