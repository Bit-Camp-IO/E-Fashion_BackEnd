import { config } from 'dotenv';
config();
import Config from './index';
import { CreateProDir } from './initDir';

type Key = keyof typeof Config;

for (const key in Config) {
  if (Config[key as Key] === undefined || Config[key as Key] === '') {
    throw new Error(`Environment variable '${key}' not found`);
  }
}

CreateProDir();
