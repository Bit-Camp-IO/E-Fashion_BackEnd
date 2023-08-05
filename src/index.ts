import './config/init';
import { ProductReviewData, addReviewToProduct } from './core/product';
import {initDB} from './database/init';
// import ProductModel from './database/models/product';
// @ts-ignore
// import products from '../DUMMY_DATA.json';
// import cluster from 'cluster';
// import path from 'path';

// Dont touch
async function main() {
  await initDB();
  import('./server/index');
  const rev: ProductReviewData = {
    comment: "This product is good as hell",
    userId: "64bcf1615084fe109ff413c9",
    productId: "64b44bcaf5a027ed2349e147",
    rate: 5
  }

  console.log(await addReviewToProduct(rev));
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
