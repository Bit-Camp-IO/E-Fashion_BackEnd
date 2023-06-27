import Config from '@/config';
import mongoose from 'mongoose';

export async function initDB() {
  await mongoose.connect(Config.MONGODB_URI);
}
