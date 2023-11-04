import { unlink } from 'node:fs/promises';

export async function removeFile(path: string): Promise<void> {
  try {
    await unlink(path);
  } catch (err) {
    return;
  }
}
