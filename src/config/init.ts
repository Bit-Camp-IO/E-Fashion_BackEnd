import { config } from 'dotenv';
config();
import Config from './index';

type Key = keyof typeof Config;

for (const key in Config) {
  if (!Config[key as Key] || Config[key as Key] === '') {
    throw new Error(`Environment variable '${key}' not found`);
  }
}
