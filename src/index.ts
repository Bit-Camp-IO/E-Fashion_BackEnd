import './config/init';
import './log';
import { initDB } from './database/init';
import { createServer } from './server/index';
// import ProductModel from './database/models/product';
// @ts-ignore
// import products from '../DUMMY_DATA.json';
// import cluster from 'cluster';
// import path from 'path';

async function main() {
  await initDB();
  createServer();
  // for (const p of products) {
  //   await ProductModel.create(p);
  // }
  // Don't work with mongoose
  // cluster.setupPrimary({
  //   exec: path.join(__dirname, 'server', 'index.ts'),
  // });

  // cluster.fork();
  // cluster.fork();

  // cluster.on('disconnect', worker => {
  //   console.log(`worker id:${worker.id} disconnected`);
  // });

  // cluster.on('listening', worker => {
  //   console.log(`worker id:${worker.id} listen`);
  // });

  // cluster.on('exit', worker => {
  //   console.log(`worker id:${worker} exit`);
  // });
}
main();
